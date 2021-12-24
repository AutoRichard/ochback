import express from 'express'
import mtngCtrl from '../controllers/meeting.controller'
//import authCtrl from '../controllers/auth.controller.js'
//import { get } from 'lodash'

const router = express.Router()


router.route('/api/meetings')
    .post(mtngCtrl.createMeeting)
    .get(mtngCtrl.listMeeting)

router.route('/api/meeting')
    .post(mtngCtrl.meetingById)

router.route('/api/meeting/:userId')
    .get(mtngCtrl.read)

router.route('/api/meetingscategory')
    .post(mtngCtrl.meetingsByCategory)

router.route('/api/meetingcategory')
    .post(mtngCtrl.meetingByCategory)

router.param('userId', mtngCtrl.meetingByUserId);



export default router


