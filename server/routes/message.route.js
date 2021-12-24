import express from 'express'
import mesgCtrl from '../controllers/message.controller'
//import authCtrl from '../controllers/auth.controller.js'
//import { get } from 'lodash'

const router = express.Router()


router.route('/api/message')
    .get(mesgCtrl.message)
    .post(mesgCtrl.sendMessage)


router.route('/api/listMessage')
    .get(mesgCtrl.listM)

router.route('/api/listConversation')
    .get(mesgCtrl.listC)


router.route('/api/conversation')
    .get(mesgCtrl.showConversation)

//router.param('linkUserID', linkCtrl.linkByUserId)

export default router


//{"recipients":[{"_id":"5f4159298558570017590363","email":"bell@gmail.com"},{"_id":"5f437cde55d37800172efdd8","email":"example@example.com"}],"_id":"5f43acb9175cb4001757bcf1","__v":0,"date":"1598270649029","lastMessage":"Hello new user "},{"recipients":[{"_id":"5f437cde55d37800172efdd8","email":"example@example.com"},{"_id":"5f4159298558570017590363","email":"bell@gmail.com"}],"_id":"5f43acca175cb4001757bcf3","__v":0,"date":"1598270666020","lastMessage":"Hi new "}