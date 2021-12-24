import express from 'express'
import userCtrl from '../controllers/user.controller'
import authCtrl from '../controllers/auth.controller.js'

const router = express.Router()


router.route('/api/users')
    .get(userCtrl.list)
    .post(userCtrl.create)

router.route('/api/listuser/:userId')
    .get(authCtrl.requireSignin, userCtrl.findFollow)

router.route('/api/users/:userId')
    .get(userCtrl.read)
    .put(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.update)
    .delete(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.remove)

router.route('/api/adminupdate/:userId')
    .put(authCtrl.requireSignin, userCtrl.update)
    .delete(authCtrl.requireSignin, userCtrl.remove)

router.route('/api/password/:userId')
    .put(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.password)

router.route('/api/userfollow')
    .put(authCtrl.requireSignin, userCtrl.addFollowing, userCtrl.addFollower)
router.route('/api/userunfollow')
    .put(authCtrl.requireSignin, userCtrl.removeFollowing, userCtrl.removeFollower)

router.route('/api/image/:userId')
    .post(userCtrl.image)

router.route('/api/usersPhoto/:userId')
    .get(userCtrl.photo, userCtrl.defaultPhoto);

router.route('/api/credit')
    .post(userCtrl.payout)

router.route('/api/resetpasswordemail')
    .post(userCtrl.resetEmailPassword)
    .put(userCtrl.resetPassword)

router.param('userId', userCtrl.userByID);

export default router  
