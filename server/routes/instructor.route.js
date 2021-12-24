import express from 'express'
import insCtrl from '../controllers/instructor.controller'
//import authCtrl from '../controllers/auth.controller.js'
//import { get } from 'lodash'

const router = express.Router()


router.route('/api/instructor')
    .post(insCtrl.create)
    .get(insCtrl.list)

router.route('/api/instructor/:id')
    .get(insCtrl.read)
    .delete(insCtrl.remove)
    .post(insCtrl.update)


router.route('/api/instructorevent/:id')
    .put(insCtrl.updateEvent)

router.route('/api/bookevent')
    .post(insCtrl.bookEvent)

router.route('/api/findevent')
    .post(insCtrl.listBookEvent)

router.route('/api/listevent')
    .get(insCtrl.listBookedEvent)


router.route('/api/readevent')
    .post(insCtrl.readEvent)



router.route('/api/instructorPhoto/:id')
    .get(insCtrl.photo)

router.param('id', insCtrl.listPostById);

export default router  