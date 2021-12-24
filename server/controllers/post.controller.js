import _ from 'lodash';
import errorHandler from './../helpers/dbErrorHandler';
import formidable from 'formidable';
import Post from '../models/post.model';
import fs from 'fs';

const create = (req, res) => {

    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    /*form.on('progress', function(bytesReceived, bytesExpected){
        var percent = Math.floor(bytesReceived / bytesExpected * 100);
        // here is where you can relay the uploaded percentage using Socket.IO
        // How can got socket here !
        socket.emit('progress', { percent: percent });
    });*/

    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Photo could not be uploaded"
            });
        }

        let postModel = new Post(fields);
        if (files.photo) {
            postModel.photo.data = fs.readFileSync(files.photo.path);
            postModel.photo.contentType = files.photo.type;
            postModel.imageExist = true
        }

        postModel.save(function (err) {
            if (err) {
                return res.status(500).json({
                    error: 'Post Creation Failed'
                });
            } else {
                let newPost = true
                let user = fields.userId
                
                res.io.sockets.emit('fetch_post', newPost)
                res.io.sockets.emit('fetch_singlle_user', user)
                return res.status(200).json({
                    message: 'Post Created'
                });
            }
        })
    });
}

const listPostByUser = (req, res, next, id) => {

    Post.find({ "postedBy": id })
        .populate('postedBy', '_id firstName lastName displayName')
        .populate('comments.postedBy', '_id firstName lastName displayName')
        .populate('likes.postedBy', '_id firstName lastName displayName')
        .select('text comments likes imageExist mediaLink createDate postedBy')
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

const listPostById = (req, res, next, id) => {

    Post.findById(id)
        .populate('postedBy', '_id firstName lastName displayName')
        .populate('comments.postedBy', '_id firstName lastName displayName')
        .populate('likes.postedBy', '_id firstName lastName displayName')
        .select('text comments photo likes mediaLink createDate postedBy')
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
    Post.find((err, result) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
            })
        }

        res.json(result)
    }).populate('postedBy', '_id firstName lastName displayName').populate('comments.postedBy', '_id firstName lastName displayName').populate('likes.postedBy', '_id firstName lastName displayName').select('text comments likes imageExist mediaLink createDate postedBy')
}

const photo = (req, res) => {
    res.set("Content-Type", req.details.photo.contentType);
    return res.send(req.details.photo.data);
}

const read = (req, res) => {
    return res.json(req.details);
}

const remove = (req, res, next) => {
    let forum = req.details;
    forum.remove((err, deletedForum) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
            });
        }
        res.json(deletedForum);
    })
}

const _postComment = (req, res) => {

    let comment = {}
    comment.text = req.body.comment;
    comment.postedBy = req.body.userId;

    Post.findByIdAndUpdate(req.body.postId, { $push: { comments: comment } }, { new: true })
        .populate('comments.postedBy', '_id name')
        .populate('postedBy', '_id name')
        .exec((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler.getErrorMessage(err)
                })
            }
            res.json(result);
        })
}

const _deleteComment = (req, res) => {
    let commentId = req.body.commentId;

    Forum.findByIdAndUpdate(req.body.forumId, { $pull: { comments: { _id: commentId } } }, { new: true })
        .exec((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler.getErrorMessage(err)
                })
            }
            res.json(result);
        })
}



export default {
    create,
    listPostByUser,
    list,
    photo,
    read,
    remove,
    _postComment,
    _deleteComment,
    listPostById
}


/*
function paginate(pageNumber, nPerPage){
    db.forum.find().skip((pageNumber-1)*nPerPage).limit(nPerPage)
}
*/