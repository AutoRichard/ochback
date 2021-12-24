import Token from '../models/token.model';
import Meeting from '../models/meeting.model';
import _ from 'lodash';
import errorHandler from './../helpers/dbErrorHandler';
import request from 'request';
import moment from 'moment';
import crypto from 'crypto';



function getToken(res, _callback) {

    Token.find((err, _token) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
            });
        }
        var tokenList = _token[0];
        var currentTime = Date.now();
        var tokenTime = tokenList.createDate;
        let diff = moment(currentTime).diff(tokenTime, 'minute');

        if (diff >= 0) {
            //request for another
            request({
                url: 'https://zoom.us/oauth/token?grant_type=refresh_token&refresh_token=' + tokenList.refresh_token,
                method: 'POST',
                headers: {
                    'Authorization': 'Basic ' + Buffer.from(process.env.clientID + ':' + process.env.clientSecret).toString('base64'),
                }
            }, (error, httpResponse, body) => {
                if (error) {
                    console.log('Error getting token from Zoom.', error)
                } else {
                    body = JSON.parse(body);
                    body.createDate = Date.now();

                    if (body.access_token != null) {
                        Token.findByIdAndUpdate(tokenList._id, { $set: { access_token: body.access_token, refresh_token: body.refresh_token, createDate: Date.now() } }, { new: true })
                            .exec((err, result) => {
                                if (err) {
                                    return res.status(400).json({
                                        error: errorHandler.getErrorMessage(err)
                                    })
                                }

                                _callback();
                            });
                    }
                }
            })
        }

    });

}

function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 10; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

const signature = (req, res) => {
    function generateSignature(apiKey, apiSecret, meetingNumber, role) {

        // Prevent time sync issue between client signature generation and zoom 
        const timestamp = new Date().getTime() - 30000
        const msg = Buffer.from(apiKey + meetingNumber + timestamp + role).toString('base64')
        const hash = crypto.createHmac(`sha256`, `${apiSecret}`).update(msg).digest('base64')
        const signature_ = Buffer.from(`${apiKey}.${meetingNumber}.${timestamp}.${role}.${hash}`).toString('base64');

        return signature_
    }

    // pass in your Zoom JWT API Key, Zoom JWT API Secret, Zoom Meeting Number, and 0 to join meeting or webinar or 1 to start meeting
    var signature = generateSignature(process.env.API_KEY, process.env.API_SECRET, req.body.mn, 0);
    console.log(signature + ' middle ' + process.env.API_KEY + ' middle ' + process.env.API_SECRET)
    let api_key = process.env.API_KEY;
    let api_sec = process.env.API_SECRET;
    return res.json({
        signature,
        api_key,
        api_sec
    });

}
 
const createMeeting = (req, res) => {



    getToken(res, function () {
        Token.find((err, _token) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler.getErrorMessage(err)
                });
            }

            let tokenList = _token[0];
            let access_token = tokenList.access_token;
            request({
                url: 'https://api.zoom.us/v2/users/' + process.env.USERID + '/meetings',
                method: 'POST',
                json: true,
                body: {
                    "topic": req.body.topic,
                    "type": 2,
                    "duration": req.body.duration,
                    "start_time": req.body.start_time + ':00Z',
                    "password": makeid(),
                    "timezone": "America/New_York"

                }, 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + Buffer.from(access_token).toString('base64'),
                    'cache-control': 'no-cache'
                }
            }, (error, httpResponse, body) => {
                if (error) {
                    return res.status(400).json({
                        error: error
                    });
                } else {
                    //body = JSON.parse(body);
                    /*meetingCredential = {
                        'topic': body.topic,
                        'duration': body.duration,
                        'start_time': body.start_time,
                        'start_url': body.start_url,
                        'created_date': body.created_date,
                        'owner': req.body.owner,
                        'join_url': body.join_url
                    }*/

                    body.owner = req.body.owner;
                    body.category = req.body.category;

                    const meetings_ = new Meeting(body);
                    //save token in the database
                    meetings_.save((err, result) => {
                        if (err) {
                            return res.status(400).json({
                                error: errorHandler.getErrorMessage(err)
                            });
                        } else {
                            return res.status(200).json({
                                status: 'Meeting created'
                            });
                        }
                    });
                }
            }).auth(null, null, true, access_token);

        });
    });
}

const listMeeting = (req, res) => {
    Meeting.find((err, meetings) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
            })
        }
        res.json(meetings)
    })
}

const meetingById = (req, res) => {
    Meeting.findById(req.body._id)
        .exec((err, meeting) => {
            if (err || !meeting) {
                return res.status(400).json({
                    error: "Meetings not found"
                });
            }
            res.json(meeting)
        });
} 

const meetingByCategory = (req, res) => {
    Meeting.find({ "owner": req.body.id, 'category': req.body.category })
        .exec((err, meeting) => {
            if (err || !meeting) {
                return res.status(400).json({
                    error: "Meetings not found"
                });
            }
            res.json(meeting)
        });
}


const meetingsByCategory = (req, res) => {
    Meeting.find({ 'category': req.body.category })
        .exec((err, meeting) => {
            if (err || !meeting) {
                return res.status(400).json({
                    error: "Meetings not found"
                });
            }
            res.json(meeting)
        });
}

const meetingByUserId = (req, res, next, id) => {
    Meeting.find({ "owner": id })
        .exec((err, meeting) => {
            if (err || !meeting) {
                return res.status(400).json({
                    error: "Meetings not found"
                });
            }
            req.details = meeting;
            next();
        });
}

const read = (req, res) => {
    return res.json(req.details);
}


export default
    {
        createMeeting, signature, listMeeting, meetingById, meetingByUserId, read, meetingByCategory, meetingsByCategory
    }