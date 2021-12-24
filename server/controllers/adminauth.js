import Admin from '../models/admin.model'
import jwt from 'jsonwebtoken'
import expressJwt from 'express-jwt'
import config from './../../config/config'

const signin = (req, res) => {
    Admin.findOne({
        "username": req.body.username
    }, (err, admin) => {

        if (err || !admin)
            return res.status('401').json({
                error: "User not found"
            })

        if (!admin.authenticate(req.body.password)) {
            return res.status('401').send({
                error: "Username and password don't match."
            })
        }

        const token = jwt.sign({
            _id: admin._id
        }, config.jwtSecret)

        res.cookie("t", token, {
            expire: new Date() + 9999
        })

        return res.json({
            token,
            user: { _id: admin._id, displayName: admin.displayName, username: admin.username }
        })

    })
}

const signout = (req, res) => {
    res.clearCookie("t")
    return res.status('200').json({
        message: "signed out"
    })
}

const requireSignin = expressJwt({
    secret: config.jwtSecret,
    userProperty: 'auth'
})

const hasAuthorization = (req, res, next) => {
    const authorized = req.profile && req.auth && req.profile._id == req.auth._id
    if (!(authorized)) {
        return res.status('403').json({
            error: "User is not authorized"
        })
    }
    next()
}

export default {
    signin,
    signout,
    requireSignin,
    hasAuthorization
}
