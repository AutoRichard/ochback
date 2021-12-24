import Admin from '../models/admin.model'
import _ from 'lodash'
import errorHandler from './../helpers/dbErrorHandler'


const create = (req, res) => {
    const admin = new Admin(req.body)
    admin.save((err, result) => {
        if (err) {
            console.log(errorHandler.getErrorMessage(err))
            return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
            })
        }
        res.status(200).json({
            message: "Successfully signed up!"
        })
    })
}

const userByID = (req, res, next, id) => {
    Admin.findById(id).exec((err, admin) => {
        if (err || !admin)
            return res.status('400').json({
                error: "User not found"
            })
        req.profile = admin

        next()
    })
}

const read = (req, res) => {
    req.profile.hashed_password = undefined
    req.profile.salt = undefined
    req.profile.photo = undefined
    return res.json(req.profile)
}

const list = (req, res) => {
    Admin.find((err, admins) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
            })
        }
        res.json(admins)
    }).select('username displayName firstName lastName updated created')
}

const update = (req, res, next) => {
    let admin = req.profile
    admin = _.extend(admin, req.body)
    admin.updated = Date.now()

    console.log(admin)

    admin.save((err, adminResult) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
            })
        }
        adminResult.hashed_password = undefined
        adminResult.salt = undefined
        adminResult.photo = undefined
        res.json(admin)
    })
}

const remove = (req, res, next) => {
    let admin = req.profile
    admin.remove((err, deletedUser) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
            })
        }
        deletedUser.hashed_password = undefined
        deletedUser.salt = undefined
        res.json(deletedUser)
    })
}

const password = (req, res, next) => {
    let admin = req.profile

    Admin.findOne({
        "username": admin.username
    }, (err, admin) => {

        if (!admin.authenticate(req.body.oldPassword)) {
            return res.status('401').send({
                error: "OLD PASSWORD IS NOT CORRECT"
            })
        }

        admin = _.extend(admin, req.body)
        admin.updated = Date.now()
        admin.save((err) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler.getErrorMessage(err)
                })
            }
            admin.hashed_password = undefined
            admin.salt = undefined
            res.status(200).json({
                message: "password changed!"
            })
        })
    })
}



export default {
    create,
    userByID,
    read,
    list,
    remove,
    update,
    password
}
