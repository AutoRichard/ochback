import _ from 'lodash';
import errorHandler from './../helpers/dbErrorHandler';
import formidable from 'formidable';
import Instructor from '../models/instructor.model';
import Token from '../models/token.model';
import User from '../models/user.model'
import fs from 'fs';
import mongoose from 'mongoose'

import request from 'request';
import moment from 'moment';


import nodemailer from 'nodemailer'
import Mailgen from 'mailgen'

const EMAIL = "ajibolarichardson96@yahoo.com"
const PASSWORD = "gsejgmlkuudexakt"



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


let transporter = nodemailer.createTransport({
    service: "Yahoo",
    secure: true,
    auth: {
        user: EMAIL,
        pass: PASSWORD,
    },
});

let MailGenerator = new Mailgen({
    theme: "default",
    product: {
        name: "OCHIT",
        link: "https://ochfront.herokuapp.com/"
    },
});


const create = (req, res) => {

    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Photo could not be uploaded"
            });
        }

        let instructorModel = new Instructor(fields);
        if (files.photo) {
            instructorModel.photo.data = fs.readFileSync(files.photo.path);
            instructorModel.photo.contentType = files.photo.type;
            //instructorModel.imageExist = true
        }

        instructorModel.save(function (err) {
            if (err) {
                return res.status(500).json({
                    error: 'Instructor Creation Failed'
                });
            } else {
                return res.status(200).json({
                    message: 'Instructor Created'
                });
            }
        })
    });
}

const listPostById = (req, res, next, id) => {

    Instructor.findById(id)
        .exec((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler.getErrorMessage(err)
                })
            }
            req.details = result;
            next();
        });
}

const list = (req, res) => {
    Instructor.find((err, result) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
            })
        }
        res.json(result)
    }).populate('event.user', '_id displayName').select('name profession pricing about created_date event.title event.link event.start event.end event._id event.hours event.user, event.booked')
}

const photo = (req, res) => {
    res.set("Content-Type", req.details.photo.contentType);
    return res.send(req.details.photo.data);
}

const update = (req, res, next) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Photo could not be uploaded"
            });
        }

        var instructor = req.details;
        instructor = _.extend(instructor, fields);
        //instructor.updated = Date.now();

        if (files.photo) {
            instructor.photo.data = fs.readFileSync(files.photo.path);
            instructor.photo.contentType = files.photo.type;
        }

        instructor.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler.getErrorMessage(err)
                });
            }
            return res.status(200).json({
                message: 'Instructor Updated'
            });
        })
    });

}

const updateEvent = (req, res, next) => {

    Instructor.findByIdAndUpdate(req.details._id, { $push: { event: req.body } }, { new: true })
        .populate('event.user', '_id displayName')
        .select('title link start end userBooked')
        .exec((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler.getErrorMessage(err)
                })
            }
            return res.status(200).json({
                message: 'Instructor Updated'
            });
        });

}

const bookEvent = (req, res, next) => {

    User.findById(req.body.userId)
        .exec((err, _user) => {
            if (err || !_user) {
                return res.status('400').json({
                    error: "User not found"
                });
            }

            if (_user.creditBalance > req.body.pricing) {

                Instructor.findOne({ "_id": req.body._id }, { "event": { $elemMatch: { _id: req.body.eventId, } } }).exec((err, results) => {
                    if (err) {
                        return res.status(400).json({
                            error: errorHandler.getErrorMessage(err)
                        })
                    }
                    if (results.event[0].booked == false) {

                        getToken(res, function () {
                            Token.find((err, _token) => {
                                if (err) {
                                    return res.status(400).json({
                                        error: errorHandler.getErrorMessage(err)
                                    });
                                }

                                /*duration*/

                                let tokenList = _token[0];
                                let access_token = tokenList.access_token;

                                let start = moment(results.event[0].start)
                                let end = moment(results.event[0].end)

                                let duration = end.diff(start, 'minutes')

                                let hours_duration = duration / 60;

                                /*duration*/

                                /*start time*/

                                let d = new Date(results.event[0].start)

                                let timeZone = d.getTimezoneOffset() / 60

                                let b = new Date(d.setHours(d.getHours() + timeZone))
                                let month = d.getMonth() + 1
                                let DayOfMonth = d.getDate();
                                let Year = d.getFullYear();
                                let Hours = d.getHours();
                                let Minutes = d.getMinutes();
                                let start_time = Year + '-' + month + '-' + DayOfMonth + 'T' + Hours + ':' + Minutes

                                /*start time*/
                                request({
                                    url: 'https://api.zoom.us/v2/users/' + process.env.USERID + '/meetings',
                                    method: 'POST',
                                    json: true,
                                    body: {
                                        "topic": results.event[0].title,
                                        "type": 2,
                                        "duration": duration,
                                        "start_time": start_time + ':00Z',
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
                                        Instructor.updateOne({ "_id": req.body._id, "event._id": req.body.eventId }, { 'event.$.user': req.body.userId, 'event.$.link': body.join_url, 'event.$.hours': hours_duration, 'event.$.booked': true, 'event.$.password': body.password, 'event.$.meeting_number': body.id })
                                            .exec((err, result) => {
                                                if (err) {
                                                    return res.status(400).json({
                                                        error: errorHandler.getErrorMessage(err)
                                                    })
                                                }

                                                let credit = { creditBalance: _user.creditBalance - req.body.pricing }
                                                _user = _.extend(_user, credit);
                                                _user.save((err) => {
                                                    if (err) {
                                                        return res.status(400).json({
                                                            error: errorHandler.getErrorMessage(err)
                                                        });
                                                    }

                                                    let name = 'ADMIN'
                                                    let userName = _user.displayName || _user.firstName || _user.lastName
                                                    let userEmail = 'larshalvorj@gmail.com'
                                                    let link = results.event[0].link
                                                    //let title = results.event[0].title

                                                    Instructor.findById(results._id)
                                                        .exec((err, __result) => {
                                                            if (err) {
                                                                return res.status(400).json({
                                                                    error: errorHandler.getErrorMessage(err)
                                                                })
                                                            }

                                                            let response = {
                                                                body: {
                                                                    name,
                                                                    intro: `${userName} has booked ${__result.name} \n\n ${link}`
                                                                },
                                                            };

                                                            let mail = MailGenerator.generate(response);




                                                            let message = {
                                                                from: '"OC HIT INSTRUCTORS" <ajibolarichardson96@yahoo.com>',
                                                                to: userEmail,
                                                                subject: "PERSONAL INSTRUCTOR",
                                                                html: mail,
                                                            };

                                                            transporter
                                                                .sendMail(message)
                                                                .then(() => {
                                                                    return res.status(200).json({
                                                                        message: 'Instructor Booked'
                                                                    });
                                                                })
                                                                .catch((error) => {
                                                                    res.json(error)
                                                                    console.error(error)
                                                                });

                                                        });




                                                });

                                            })
                                    }
                                }).auth(null, null, true, access_token);

                            });
                        });














                    } else {
                        return res.status(400).json({
                            message: 'Instructor Not Available'
                        });
                    }


                })
            } else {

                return res.status(400).json({
                    error: "Insufficient Balance"
                })

            }








        })





}

const listBookEvent = (req, res, next) => {

    let user = req.body.userId

    Instructor.aggregate([
        {
            "$match": {
                "event": {
                    "$elemMatch": {
                        'user': mongoose.Types.ObjectId(user)
                    }
                },
            }
        },
        {
            "$project": {
                "event": {
                    "$filter": {
                        "input": "$event",
                        "as": "event",
                        "cond": {
                            "$eq": ["$$event.user", mongoose.Types.ObjectId(user)]
                        }
                    }
                },
                'name': '$name'
            }
        },
        { $unwind: "$event" },
        { $addFields: { event: { $mergeObjects: "$event" } } }
    ]).exec((err, result) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
            })
        }

        return res.status(200).json(result);
    })
}

const listBookedEvent = (req, res, next) => {
    Instructor.aggregate([
        { $unwind: "$event" },
        { $addFields: { event: { $mergeObjects: "$event" } } },
        {
            $lookup: {
                from: 'User',
                localField: 'event.user',
                foreignField: '_id',
                as: 'fromObj',
            },
        },
    ]).exec((err, result) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
            })
        }


        let results = result.map((item) => {
            return {
                _id: item._id,
                event: item.event,
                name: item.name,
                pricing: item.pricing
            }
        });
        return res.status(200).json(results);
    })
}

const readEvent = (req, res) => {

    Instructor.findOne({ "_id": req.body._id }, { "event": { $elemMatch: { _id: req.body.eventId } } }).exec((err, results) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
            })
        }

        return res.status(200).json(results);

    })

}

const read = (req, res) => {
    return res.json(req.details);
}

const remove = (req, res, next) => {
    let instructor = req.details;
    instructor.remove((err, deletedInstructor) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
            });
        }
        res.json(deletedInstructor);
    })
}



export default {
    create,
    list,
    listPostById,
    photo,
    read,
    remove,
    update,
    updateEvent,
    bookEvent,
    listBookEvent,
    listBookedEvent,
    readEvent
}