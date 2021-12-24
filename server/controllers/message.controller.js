import Message from '../models/message.model'
import Conversation from '../models/conversation.model'
import _, { identity } from 'lodash'
import errorHandler from './../helpers/dbErrorHandler'
import formidable from 'formidable';
import mongoose from 'mongoose';
//import fs from 'fs';


const message = (req, res) => {
    let user1 = mongoose.Types.ObjectId(req.query.sender);
    let user2 = mongoose.Types.ObjectId(req.query.reciever);


    Conversation.findOneAndUpdate(
        {
            recipients: {
                $all: [
                    { $elemMatch: { $eq: user1 } },
                    { $elemMatch: { $eq: user2 } },
                ],
            },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true },
        function (err, conversation) {
            if (err) {
                return res.status(400).json({
                    error: errorHandler.getErrorMessage(err)
                });
            } else {
                if (req.query.sender == conversation.sendLast) {

                    let convUpdate = {
                        read: true
                    }
                    Conversation.findByIdAndUpdate(conversation._id, convUpdate, function (err, _conversation2) {
                        if (err) {
                            return res.status(400).json({
                                error: errorHandler.getErrorMessage(err)
                            });
                        }
                    })
                }



                Message.aggregate([
                    {
                        $lookup: {
                            from: 'User',
                            localField: 'to',
                            foreignField: '_id',
                            as: 'toObj',
                        },
                    },
                    {
                        $lookup: {
                            from: 'User',
                            localField: 'from',
                            foreignField: '_id',
                            as: 'fromObj',
                        },
                    },
                ])
                    .match({
                        $or: [
                            { $and: [{ to: user1 }, { from: user2 }] },
                            { $and: [{ to: user2 }, { from: user1 }] },
                        ],
                    })
                    .project({
                        'toObj.password': 0,
                        'toObj.__v': 0,
                        'toObj.date': 0,
                        'fromObj.password': 0,
                        'fromObj.__v': 0,
                        'fromObj.date': 0,
                    })
                    .exec((err, messages) => {
                        if (err) {
                            return res.status(400).json({
                                error: errorHandler.getErrorMessage(err)
                            });
                        } else {
                            res.status(200).json(messages)
                        }
                    });
            }
        }
    );


}

const sendMessage = (req, res) => {
    let from = mongoose.Types.ObjectId(req.body.sender);
    let to = mongoose.Types.ObjectId(req.body.reciever);

    Conversation.findOneAndUpdate(
        {
            recipients: {
                $all: [
                    { $elemMatch: { $eq: from } },
                    { $elemMatch: { $eq: to } },
                ],
            },
        },
        {
            recipients: [req.body.sender, req.body.reciever],
            lastMessage: req.body.body,
            read: false,
            sendLast: req.body.sender,
            recieveLast: req.body.reciever,
            deleivered: false,
            date: Date.now(),
        },
        { upsert: true, new: true, setDefaultsOnInsert: true },
        function (err, conversation) {
            if (err) {
                return res.status(400).json({
                    error: errorHandler.getErrorMessage(err)
                });
            } else {
                let message = new Message({
                    conversation: conversation._id,
                    to: req.body.reciever,
                    from: req.body.sender,
                    body: req.body.body,
                });

                message.save(err => {
                    if (err) {
                        return res.status(400).json({
                            error: errorHandler.getErrorMessage(err)
                        });
                    } else {
                        res.status(200).json({
                            message: 'Success',
                            conversationId: conversation._id
                        })


                    }
                });
            }
        }
    );
}

const listM = (req, res) => {
    Message.find((err, message) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
            });
        }
        res.json(message);
    }).populate('conversation to from', '_id email');
}

const listC = (req, res) => {
    Conversation.find((err, conversation) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
            });
        }
        res.json(conversation);
    }).populate('recipients', '_id email');
}

const showConversation = (req, res) => {
    let from = mongoose.Types.ObjectId(req.query.sender);

    Conversation.aggregate([{
        $lookup: {
            from: 'User',
            localField: 'recipients',
            foreignField: '_id',
            as: 'recipientObj',
        },
    },
    ])
        .match({ recipients: { $all: [{ $elemMatch: { $eq: from } }] } })
        .project({
            'recipientObj.password': 0,
            'recipientObj.__v': 0,
            'recipientObj.date': 0,
        })
        .exec((err, conversations) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler.getErrorMessage(err)
                });
            } else {
                let bulkConversation = conversations.map((item) => {
                    return item._id
                });
                let _bulkConversation = {
                    "_id": {
                        "$in": bulkConversation
                    }
                }

                Conversation.find(_bulkConversation, (err, _conversation2) => {
                    if (err) {
                        return res.status(400).json({
                            error: errorHandler.getErrorMessage(err)
                        });
                    }
                    res.json(_conversation2);
                }).populate('recipients', '_id firstName lastName displayName userStatus');
            }
        });
}

export default {
    message,
    sendMessage,
    listM,
    listC,
    showConversation
}
