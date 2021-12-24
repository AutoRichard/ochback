import express from 'express'
import sesCtrl from '../controllers/session.controller'
//import authCtrl from '../controllers/auth.controller.js'
//import { get } from 'lodash'

const router = express.Router()

router.route('/api/session')
    .post(sesCtrl.create)
    .get(sesCtrl.list)

router.route('/api/session/:id')
    .get(sesCtrl.read)
    .delete(sesCtrl.remove)
    .post(sesCtrl.update)

router.route('/api/sessionPhoto/:id')
    .get(sesCtrl.photo)

router.param('id', sesCtrl.linkByID);

export default router