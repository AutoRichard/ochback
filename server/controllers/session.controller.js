import _ from 'lodash';
import errorHandler from './../helpers/dbErrorHandler';
import formidable from 'formidable';
import Session from '../models/session.model';
import JoinSession from '../models/joinSession.model'
import User from '../models/user.model'
import fs from 'fs';
import mongoose from 'mongoose'

import request from 'request';
import moment from 'moment';



const create = (req, res) => {

    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Photo could not be uploaded"
            });
        }

        let sessionModel = new Session(fields);
        if (files.photo) {
            sessionModel.photo.data = fs.readFileSync(files.photo.path);
            sessionModel.photo.contentType = files.photo.type;
        }

        console.log(fields)

        sessionModel.save(function (err) {
            if (err) {
                return res.status(500).json({
                    error: 'Session Creation Failed'
                });
            } else {
                return res.status(200).json({
                    message: 'Session Created'
                });
            }
        })
    });
}

const list = (req, res) => {
    Session.find((err, session) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
            });
        }
        res.json(session);
    }).select("title start duration join feature created_date pricing link limit")
}

const linkByID = (req, res, next, id) => {
    Session.findById(id)
        .exec((err, session) => {
            if (err || !session) {
                return res.status(400).json({
                    error: "Session not found"
                });
            }

            req.details = session;

            next();
        });
}

const read = (req, res, next) => {
    return res.json(req.details);
}

const update = (req, res, next) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Session update failed"
            });
        }

        var session = req.details;
        session = _.extend(session, fields);
        session.updated = Date.now();

        session.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler.getErrorMessage(err)
                });
            }
            res.json(result);
        });
    });
}

const remove = (req, res, next) => {
    let session = req.details;
    session.remove((err, deletedSession) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
            });
        }
        res.json(deletedSession);
    });
}

const photo = (req, res) => {
    res.set("Content-Type", req.details.photo.contentType);
    return res.send(req.details.photo.data);
}





export default {
    create,
    list,
    linkByID,
    read,
    update,
    remove,
    photo
}