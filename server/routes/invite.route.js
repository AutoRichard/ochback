import express from 'express'
import inviteCtrl from '../controllers/invite.controller'
import authCtrl from '../controllers/auth.controller.js'
//import { get } from 'lodash'

const router = express.Router()


router.route('/api/invite')
    .post(inviteCtrl.create)
    .get(inviteCtrl.list)


router.route('/api/invite/:userId')
    .get(inviteCtrl.read)

router.route('/api/invitecontact')
    .post(inviteCtrl.listContact)

router.route('/api/deleteinvite')
    .post(inviteCtrl.remove)


router.param('userId', inviteCtrl.listInvitation);


export default router  