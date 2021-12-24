import express from 'express'
import adminCtrl from '../controllers/admin.controller'
import authCtrl from '../controllers/auth.controller.js'

const router = express.Router()


router.route('/api/admins')
    .get(adminCtrl.list)
    .post(adminCtrl.create)

router.route('/api/admin/:adminId')
    .get(adminCtrl.read)
    .put(authCtrl.requireSignin, authCtrl.hasAuthorization, adminCtrl.update)
    .delete(authCtrl.requireSignin, authCtrl.hasAuthorization, adminCtrl.remove)

router.route('/api/password/:userId')
    .put(authCtrl.requireSignin, authCtrl.hasAuthorization, adminCtrl.password)


router.param('adminId', adminCtrl.userByID);

export default router  
