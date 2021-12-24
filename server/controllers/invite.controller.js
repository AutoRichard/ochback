import Invite from '../models/invite.model'
import User from '../models/user.model'
import _, { identity } from 'lodash'
import errorHandler from './../helpers/dbErrorHandler'



const create = (req, res) => {


    const invite = new Invite(req.body);

    invite.save((err, result) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
            });
        }
        res.status(200).json(result)
    });



}

const listInvitation = (req, res, next, id) => {
    Invite.find({ "user_id": id, "accept": false})
        .populate('meeting_id', '_id topic start_time duration start_url id join_url password created_date')
        .populate('owner_id', '_id firstName lastName displayName')
        .populate('user_id', '_id firstName lastName displayName')
        .exec((err, invite) => {
            if (err || !invite) {
                return res.status(400).json({
                    error: "Invitation not found"
                });
            }

            req.details = invite;
            next();
        });
}

const read = (req, res) => {
    return res.json(req.details);
}

const list = (req, res) => {
    Invite.find((err, invite) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
            });
        }
        res.json(invite);
    })
}

const listContact = (req, res) => {
    Invite.find({ "meeting_id": req.body.meeting_id })
        .lean()
        .exec((err, invite) => {
            if (err || !invite) {
                return res.status(400).json({
                    error: "Invite not found"
                });
            }

            let inviteContact = invite

            let bulkCollection = inviteContact.map((item) => {
                return item.user_id

            });
            User.find({ "_id": { "$nin": bulkCollection } })
                .select('name email displayName firstName lastName updated created userStatus creditBalance')
                .exec((err, users) => {
                    if (err) {
                        return res.status(400).json({
                            error: errorHandler.getErrorMessage(err)
                        })
                    }
                    res.json(users)
                })
        });
}

const remove = (req, res, next) => {
    let invite = req.body.invite_id;
    
    Invite.findByIdAndRemove(invite, (err, deletedInvite) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
            });
        }
        res.json(deletedInvite);
    })
}


export default {
    create,
    listInvitation,
    read,
    list,
    listContact,
    remove
}