import Link from '../models/link.model'
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

        var linkModel = new Link(fields);

        linkModel.save(function (err, result) {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            } else {
                res.status(200).json(result)
            }
        });
    });
}

const list = (req, res) => {
    Link.find((err, link) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
            });
        }
        res.json(link);
    }).populate('userId', '_id email').select('userId facebook facebookStatus instagram instagramStatus spotify spotifyStatus youtube youtubeStatus tiktok tiktokStatus snapchat snapchatStatus linkUrlAudio linkUrlVideo.text linkUrlVideo.title linkUrlVideo.created linkUrlVideo.postedBy linkUrlVideo._id updated created');
}

const linkByID = (req, res, next, id) => {
    Link.findById(id)
        .exec((err, link) => {
            if (err || !link) {
                return res.status(400).json({
                    error: "Links not found"
                });
            }

            req.details = link;

            next();
        });
}

const linkByVideoId = (req, res, next, id) => {
    Link.findOne({
        "linkUrlVideo._id": id
    }).exec((err, result) => {
        if (err || !result) {
            return res.status(400).json({
                error: "Image not found"
            });
        }

        req.details = result.linkUrlVideo.id(id)

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
                error: "Links update failed"
            });
        }

        var link = req.details;
        link = _.extend(link, fields);
        link.updated = Date.now();

        link.save((err, result) => {
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
    let link = req.details;
    link.remove((err, deletedLink) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
            });
        }
        res.json(deletedLink);
    });
}

const count = (req, res) => {
    Link.find({ "userId": req.body.userId })
        .exec((err, link) => {
            if (err || !link) {
                return res.status(400).json({
                    error: "links not found"
                });
            }

            return res.status(200).json({
                link: link
            });
        });
}

//update {comment, userId, blogId}
const _postAudio = (req, res) => {

    let link = {}
    link.text = req.body.linkUrlAudio;
    link.postedBy = req.body.userId;
    link.title = req.body.title;

    Link.findByIdAndUpdate(req.body.linkId, { $push: { linkUrlAudio: link } }, { new: true })
        .populate('linkUrlAudio.postedBy', '_id name')
        .select('linkUrlAudio')
        .exec((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler.getErrorMessage(err)
                })
            }
            res.json(result);
        });
}

//delete {commentId and blogId}
const _deleteAudio = (req, res) => {
    let audioId = req.body.audioId;

    Link.findByIdAndUpdate(req.body.linkId, { $pull: { linkUrlAudio: { _id: audioId } } }, { new: true })
        .exec((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler.getErrorMessage(err)
                })
            }
            res.json(result);
        })
}


const _postVideo = (req, res) => {


    let form = new formidable.IncomingForm();
    form.keepExtensions = true;


    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Link Creation Failed"
            });
        }

        let link = {
            photo: {

            }
        }
        link.text = fields.linkUrlVideo;
        link.postedBy = fields.userId;
        link.title = fields.title;

        if (files.photo) {
            link.photo.data = fs.readFileSync(files.photo.path);
            link.photo.contentType = files.photo.type;
        }



        Link.findByIdAndUpdate(fields.linkId, { $push: { linkUrlVideo: link } }, { new: true })
            .populate('linkUrlVideo.postedBy', '_id name')
            .exec((err, result) => {
                if (err) {
                    return res.status(400).json({
                        error: 'errorHandler.getErrorMessage(err)'
                    })
                }

                return res.status(200).json({
                    data: result
                })
            });
    });
}

const _deleteVideo = (req, res) => {
    let videoId = req.body.videoId;

    Link.findByIdAndUpdate(req.body.linkId, { $pull: { linkUrlVideo: { _id: videoId } } }, { new: true })
        .exec((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler.getErrorMessage(err)
                })
            }

            res.json(result);
        })
}

const photo = (req, res) => {
    if (req.details.photo.data) {
        res.set("Content-Type", req.details.photo.contentType);
        return res.send(req.details.photo.data);
    }
}



export default {
    create,
    list,
    linkByID,
    read,
    update,
    remove,
    count,
    _postAudio,
    _deleteAudio,
    _postVideo,
    _deleteVideo,
    photo,
    linkByVideoId
}
