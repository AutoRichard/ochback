import _ from 'lodash';
import errorHandler from './../helpers/dbErrorHandler';
import formidable from 'formidable';
import News from '../models/news.model';
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

        let newsModel = new News(fields);
        if (files.photo) {
            newsModel.photo.data = fs.readFileSync(files.photo.path);
            newsModel.photo.contentType = files.photo.type;
            newsModel.imageExist = true
        }

        newsModel.save(function (err) {
            if (err) {
                return res.status(500).json({
                    error: 'Post Creation Failed'
                });
            } else {
                return res.status(200).json({
                    message: 'News Created'
                });
            }
        })
    });
}


const listPostById = (req, res, next, id) => {

    News.findById(id)
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
    News.find((err, result) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
            })
        }

        res.json(result)
    }).select('text title mediaLink createDate')
}

const photo = (req, res) => {
    res.set("Content-Type", req.details.photo.contentType);
    return res.send(req.details.photo.data);
}

const read = (req, res) => {
    return res.json(req.details);
}

const remove = (req, res, next) => {
    let news = req.details;
    news.remove((err, deletedNews) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
            });
        }
        res.json(deletedNews);
    })
}

export default {
    create,
    list,
    listPostById,
    photo,
    read,
    remove,
}