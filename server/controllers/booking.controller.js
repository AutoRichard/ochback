import Booking from '../models/booking.model'
import User from '../models/user.model'
import Invite from '../models/invite.model'
import _, { identity } from 'lodash'
import errorHandler from './../helpers/dbErrorHandler'
import formidable from 'formidable';
import fs from 'fs';
import mongoose from 'mongoose';


const create = (req, res) => {

    let form = new formidable.IncomingForm();
    form.keepExtensions = true;


    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Link Creation Failed"
            });
        }


        User.findById(fields.user_id)
            .exec((err, _user) => {
                if (err || !_user) {
                    return res.status('400').json({
                        error: "User not found"
                    });
                }
                let credit = { creditBalance: _user.creditBalance - fields.hour }
                _user = _.extend(_user, credit);
                _user.save((err) => {
                    if (err) {
                        return res.status(400).json({
                            error: errorHandler.getErrorMessage(err)
                        });
                    }

                    var bookingModel = new Booking(fields);

                    bookingModel.save(function (err, result) {
                        if (err) {
                            return res.status(400).json({
                                error: err
                            });
                        } else {
                            Invite.findOneAndUpdate({
                                "user_id": fields.user_id,
                                "meeting_id": fields.meeting_id
                            })
                                .lean()
                                .exec((err, __result) => {
                                    if (err) {
                                        return res.status(400).json({
                                            error: err
                                        });
                                    } else {
                                        Invite.findByIdAndUpdate(__result._id, { $set: { "accept": true } }, { new: true }, function (err, updated) {
                                            if (err) {
                                                return res.status(400).json({
                                                    error: err
                                                });
                                            } else {
                                                res.status(200).json(result)

                                            }
                                        });
                                    }
                                })

                        }
                    });


                });
            });


    });
}

const list = (req, res) => {
    Booking.find((err, booking) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
            });
        }
        res.json(booking);
    })
}

const count = (req, res) => {
    Booking.find({ "meeting_id": req.body.meeting_id, "user_id": req.body.user_id })
        .populate('meeting_id', '_id topic start_time duration start_url id join_url password created_date')
        .populate('user_id', '_id firstName lastName')
        .exec((err, booking) => {
            if (err || !booking) {
                return res.status(400).json({
                    error: "Booking not found"
                });
            }

            return res.status(200).json({
                booking: booking
            });
        });
}
const listBooking = (req, res) => {
    Booking.find({ "user_id": req.body.user_id })
        .populate('meeting_id', '_id topic start_time duration start_url id join_url password created_date')
        .populate('user_id', '_id firstName lastName')
        .populate('owner_id', '_id firstName lastName')
        .exec((err, booking) => {
            if (err || !booking) {
                return res.status(400).json({
                    error: "Booking not found"
                });
            }

            return res.status(200).json({
                booking: booking
            });
        });
}



export default {
    create,
    list,
    count,
    listBooking
}