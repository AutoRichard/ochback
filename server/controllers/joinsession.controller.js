import JoinSession from '../models/joinSession.model'
import Session from '../models/session.model'
import User from '../models/user.model'
import _, { identity } from 'lodash'
import errorHandler from './../helpers/dbErrorHandler'
import formidable from 'formidable';


const create = (req, res) => {

    let form = new formidable.IncomingForm();
    form.keepExtensions = true;



    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Session Creation Failed"
            });
        }

        //check if session exist
        Session.findById(fields.session_id).exec((err, __result) => {

            if (err || !__result) {
                return res.status('400').json({
                    error: "Session not found"
                });
            }

            if (__result.limit >= __result.join) {

                //check user credit balance
                User.findById(fields.user_id)
                    .exec((err, _user) => {
                        if (err || !_user) {
                            return res.status('400').json({
                                error: "User not found"
                            });
                        }


                        if (_user.creditBalance > fields.pricing) {

                            //check if user already booked it before
                            JoinSession.find({ "user_id": fields.user_id, "session_id": fields.session_id }).exec((err, results) => {
                                if (err) {
                                    return res.status(400).json({
                                        error: errorHandler.getErrorMessage(err)
                                    })
                                }
                                
                                if (results.length == 0) {

                                    //book session
                                    var bookingModel = new JoinSession(fields);

                                    bookingModel.save(function (err, result) {
                                        if (err) {
                                            return res.status(400).json({
                                                error: err
                                            });
                                        } else {



                                            //deduct money
                                            let credit = { creditBalance: _user.creditBalance - fields.pricing }
                                            _user = _.extend(_user, credit);
                                            _user.save((err) => {
                                                if (err) {
                                                    return res.status(400).json({
                                                        error: errorHandler.getErrorMessage(err)
                                                    });
                                                }


                                                Session.findByIdAndUpdate(fields.session_id, { $set: { join: __result.join + 1 } }, { new: true })
                                                    .exec((err, result) => {
                                                        if (err) {
                                                            return res.status(400).json({
                                                                error: errorHandler.getErrorMessage(err)
                                                            })
                                                        }

                                                        return res.status(200).json({
                                                            success: "Session Booked"
                                                        })
                                                    });




                                            });
                                        }
                                    });
                                } else {
                                    return res.status(400).json({
                                        error: 'Session Already Booked'
                                    });
                                }
                            })
                        } else {
                            return res.status(400).json({
                                error: "Insufficient Balance"
                            })
                        }
                    })
            } else {
                return res.status(400).json({
                    error: "Session Not Available"
                })
            }

        })
    });
}

const listJSession = (req, res) => {
    JoinSession.find({ "user_id": req.body.user_id })
        .populate('session_id', '_id title pricing start end link join limit created_date')
        .populate('user_id', '_id firstName lastName email')
        .exec((err, session) => {
            if (err || !session) {
                return res.status(400).json({
                    error: "Session not found"
                });
            }

            return res.status(200).json(session);
        });
}

const listJdSession = (req, res) => {
    JoinSession.find({ "session_id": req.body.session_id })
        .populate('session_id', '_id title pricing start end link join limit created_date')
        .populate('user_id', '_id firstName lastName email')
        .exec((err, session) => {
            if (err || !session) {
                return res.status(400).json({
                    error: "Session not found"
                });
            }

            return res.status(200).json(session);
        });
}

const list = (req, res) => {
    JoinSession.find((err, jsession) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
            });
        }
        res.json(jsession);
    }).populate('session_id', '_id title pricing start end link join limit created_date').populate('user_id', '_id firstName lastName email')
}




export default {
    create,
    listJSession,
    list,
    listJdSession
}