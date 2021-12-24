import _ from 'lodash';
import errorHandler from './../helpers/dbErrorHandler';
import Newsletter from '../models/newsletter.model';

const create = (req, res) => {

    const newsletter = new Newsletter(req.body);

    newsletter.save((err, result) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
            });
        }
        res.status(200).json(result)
    });
}


const listPostById = (req, res, next, id) => {

    Newsletter.findById(id)
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
    Newsletter.find((err, result) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
            })
        }

        res.json(result)
    })
}

const remove = (req, res, next) => {
    let newsletter = req.details;
    newsletter.remove((err, deletedNews) => {
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
    remove,
    listPostById
}