import Token from '../models/token.model';
import _ from 'lodash';
import errorHandler from './../helpers/dbErrorHandler';
import request from 'request';
import moment from 'moment';
import crypto from 'crypto';


function getToken(res, _callback) {


    //check if token in the database
    Token.count((err, token) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
            });
        }
        //check if token exist in the database
        if (token == 0) {


            //request for token
            request({
                url: `https://zoom.us/oauth/token?grant_type=refresh_token&refresh_token=eyJhbGciOiJIUzUxMiIsInYiOiIyLjAiLCJraWQiOiI3M2Q5OGYzNi01OThjLTQwYmQtYmUwMi1hMzdlMjhkYTdjN2QifQ.eyJ2ZXIiOjcsImF1aWQiOiIxMjg0ODFlNjE2MDNhY2I0ZjBkYTk5ZmYyYzk2MmM3MiIsImNvZGUiOiJGbGQ3dlFBbnJaXzc0UmpWTFlIU0VHUV9IM0ZEYlYtT1EiLCJpc3MiOiJ6bTpjaWQ6eFhuY2N5eXhTMFNmNUhhS0FtcnZhQSIsImdubyI6MCwidHlwZSI6MSwidGlkIjowLCJhdWQiOiJodHRwczovL29hdXRoLnpvb20udXMiLCJ1aWQiOiI3NFJqVkxZSFNFR1FfSDNGRGJWLU9RIiwibmJmIjoxNjAwODY0NDU3LCJleHAiOjIwNzM5MDQ0NTcsImlhdCI6MTYwMDg2NDQ1NywiYWlkIjoiRFBISGcyQnlUNXV2MVBDeXlIYlZHdyIsImp0aSI6IjQwZTg2M2Q1LTgzMDgtNDVhNS04ZjYxLTIwMWNiNmI2MWFhNiJ9.LG1hi5fGwVUekC4ebtMRLQS20TumVwpCZ2w5_jrL5GiCCVjJE8yCJzlWNAEM2elhD8M3kBo6nqIsf5aotT11UA`,
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
                    const token_ = new Token(body);

                    //save token in the database
                    token_.save((err, result) => {
                        if (err) {
                            return res.status(400).json({
                                error: errorHandler.getErrorMessage(err)
                            });
                        }
                        console.log(result);
                        _callback();
                    });
                }
            })
        } else {

            //check token in the database
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


                            console.log('first: ' + body.access_token);
                            console.log('second:' + body.refresh_token);
                            body.createDate = Date.now();

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
                    })
                }

            });
        }


    });

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

const check = (req, res) => {
    let signature = 'success';

    return res.json({
        signature
    });
}

const home = (req, res) => {

    getToken(res, function () {
        Token.find((err, token) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler.getErrorMessage(err)
                });
            }

            console.log(token)
            //var tokenList = token[0];
            //console.log('second: ' + tokenList.access_token);
        });
        res.render('home', { title: 'Welcome' });
    });
}

const main = (req, res) => {

    getToken(res, function () {
        Token.find((err, token) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler.getErrorMessage(err)
                });
            }
            var tokenList = token[0];
            request.get('https://api.zoom.us/v2/users/me', (error, response, body) => {
                if (error) {
                    console.log('API Response Error: ', error)
                } else {
                    body = JSON.parse(body);
                    // Display response in console
                    console.log('API call ', body);
                    // Display response in browser
                    var JSONResponse = '<pre><code>' + JSON.stringify(body, null, 2) + '</code></pre>'
                    res.send(`
                            <style>
                                @import url('https://fonts.googleapis.com/css?family=Open+Sans:400,600&display=swap');@import url('https://necolas.github.io/normalize.css/8.0.1/normalize.css');html {color: #232333;font-family: 'Open Sans', Helvetica, Arial, sans-serif;-webkit-font-smoothing: antialiased;-moz-osx-font-smoothing: grayscale;}h2 {font-weight: 700;font-size: 24px;}h4 {font-weight: 600;font-size: 14px;}.container {margin: 24px auto;padding: 16px;max-width: 720px;}.info {display: flex;align-items: center;}.info>div>span, .info>div>p {font-weight: 400;font-size: 13px;color: #747487;line-height: 16px;}.info>div>span::before {content: "👋";}.info>div>h2 {padding: 8px 0 6px;margin: 0;}.info>div>p {padding: 0;margin: 0;}.info>img {background: #747487;height: 96px;width: 96px;border-radius: 31.68px;overflow: hidden;margin: 0 20px 0 0;}.response {margin: 32px 0;display: flex;flex-wrap: wrap;align-items: center;justify-content: space-between;}.response>a {text-decoration: none;color: #2D8CFF;font-size: 14px;}.response>pre {overflow-x: scroll;background: #f6f7f9;padding: 1.2em 1.4em;border-radius: 10.56px;width: 100%;box-sizing: border-box;}
                            </style>
                            <div class="container">
                                <div class="info">
                                    <img src="${body.pic_url}" alt="User photo" />
                                    <div>
                                        <span>Hello World!</span>
                                        <h2>${body.first_name} ${body.last_name}</h2>
                                        <p>${body.role_name}, ${body.company}</p>
                                    </div>
                                </div>
                                <div class="response">
                                    <h4>JSON Response:</h4>
                                    <a href="https://marketplace.zoom.us/docs/api-reference/zoom-api/users/user" target="_blank">
                                        API Reference
                                    </a>
                                    ${JSONResponse}
                                </div>
                            </div>
                        `);
                }
            }).auth(null, null, true, tokenList.access_token);
        });
    });
}

const createUser = (req, res) => {
    getToken(function () {
        Token.find((err, token) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler.getErrorMessage(err)
                });
            }
            res.render('users', { title: 'User Management' });
        });

    });
}


const newToken = (req, res) => {
    // Step 1: 
    // Check if the code parameter is in the url 
    // if an authorization code is available, the user has most likely been redirected from Zoom OAuth
    // if not, the user needs to be redirected to Zoom OAuth to authorize

    if (req.query.code) {

        // Step 3: 
        // Request an access token using the auth code

        let url = 'https://zoom.us/oauth/token?grant_type=authorization_code&code=' + req.query.code + '&redirect_uri=' + process.env.redirectURL;



        request.post(url, (error, response, body) => {

            // Parse response to JSON
            body = JSON.parse(body);

            console.log(body)

            // Logs your access and refresh tokens in the browser
            console.log(`access_token: ${body.access_token}`);
            console.log(`refresh_token: ${body.refresh_token}`);

            if (body.access_token) {
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
                        Token.findByIdAndUpdate(tokenList._id, { $set: { access_token: body.access_token, refresh_token: body.refresh_token, createDate: Date.now() } }, { new: true })
                            .exec((err, result) => {
                                if (err) {
                                    return res.status(400).json({
                                        error: errorHandler.getErrorMessage(err)
                                    })
                                }

                            });
                    }

                });
            }

            return res.status(200).json({
                refresh_token: body.refresh_token
            });



            if (body.access_token) {


                // Step 4:
                // We can now use the access token to authenticate API calls

                // Send a request to get your user information using the /me context
                // The `/me` context restricts an API call to the user the token belongs to
                // This helps make calls to user-specific endpoints instead of storing the userID

                request.get('https://api.zoom.us/v2/users/me', (error, response, body) => {
                    if (error) {
                        console.log('API Response Error: ', error)
                    } else {
                        body = JSON.parse(body);
                        // Display response in console
                        console.log('API call ', body);
                        // Display response in browser
                        var JSONResponse = '<pre><code>' + JSON.stringify(body, null, 2) + '</code></pre>'
                        res.send(`
                            <style>
                                @import url('https://fonts.googleapis.com/css?family=Open+Sans:400,600&display=swap');@import url('https://necolas.github.io/normalize.css/8.0.1/normalize.css');html {color: #232333;font-family: 'Open Sans', Helvetica, Arial, sans-serif;-webkit-font-smoothing: antialiased;-moz-osx-font-smoothing: grayscale;}h2 {font-weight: 700;font-size: 24px;}h4 {font-weight: 600;font-size: 14px;}.container {margin: 24px auto;padding: 16px;max-width: 720px;}.info {display: flex;align-items: center;}.info>div>span, .info>div>p {font-weight: 400;font-size: 13px;color: #747487;line-height: 16px;}.info>div>span::before {content: "👋";}.info>div>h2 {padding: 8px 0 6px;margin: 0;}.info>div>p {padding: 0;margin: 0;}.info>img {background: #747487;height: 96px;width: 96px;border-radius: 31.68px;overflow: hidden;margin: 0 20px 0 0;}.response {margin: 32px 0;display: flex;flex-wrap: wrap;align-items: center;justify-content: space-between;}.response>a {text-decoration: none;color: #2D8CFF;font-size: 14px;}.response>pre {overflow-x: scroll;background: #f6f7f9;padding: 1.2em 1.4em;border-radius: 10.56px;width: 100%;box-sizing: border-box;}
                            </style>
                            <div class="container">
                                <div class="info">
                                    <img src="${body.pic_url}" alt="User photo" />
                                    <div>
                                        <span>Hello World!</span>
                                        <h2>${body.first_name} ${body.last_name}</h2>
                                        <p>${body.role_name}, ${body.company}</p>
                                    </div>
                                </div>
                                <div class="response">
                                    <h4>JSON Response:</h4>
                                    <a href="https://marketplace.zoom.us/docs/api-reference/zoom-api/users/user" target="_blank">
                                        API Reference
                                    </a>
                                    ${JSONResponse}
                                </div>
                            </div>
                        `);
                    }
                }).auth(null, null, true, body.access_token);

            } else {
                // Handle errors, something's gone wrong!
            }

        }).auth(process.env.clientID, process.env.clientSecret);

        return;

    }

    // Step 2: 
    // If no authorization code is available, redirect to Zoom OAuth to authorize
    res.redirect('https://zoom.us/oauth/authorize?response_type=code&client_id=' + process.env.clientID + '&redirect_uri=' + process.env.redirectURL)
}


const createUsers = (req, res) => {
    getToken(function () {
        Token.find((err, token) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler.getErrorMessage(err)
                });
            }
            var tokenList = token[0];
            request({
                url: 'https://api.zoom.us/v2/users',
                method: 'POST',
                json: true,
                body: {
                    "action": "create",
                    "user_info": {
                        "email": req.body.email,
                        "type": 1,
                        "first_name": req.body.fname,
                        "last_name": req.body.lname
                    }
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + Buffer.from(process.env.clientID + ':' + process.env.clientSecret).toString('base64'),
                    'cache-control': 'no-cache'
                }
            }, (error, httpResponse, body) => {
                if (error) {
                    console.log(error)
                } else {
                    console.log(body)
                    res.redirect('/createUser');
                }
            }).auth(null, null, true, tokenList.access_token);
        });
    });
}


export default {
    signature, check, home, main, createUser, createUsers, newToken
}
