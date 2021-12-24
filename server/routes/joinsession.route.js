import express from 'express'
import jesCtrl from '../controllers/joinsession.controller'
//import authCtrl from '../controllers/auth.controller.js'
//import { get } from 'lodash'

const router = express.Router()


router.route('/api/joinsession')
    .post(jesCtrl.create)
    .get(jesCtrl.list)

router.route('/api/joinedsession')
    .post(jesCtrl.listJSession)

router.route('/api/jointsession')
    .post(jesCtrl.listJdSession)



export default router