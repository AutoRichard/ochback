import express from 'express'
import newsletterCtrl from '../controllers/newsletter.controller'
//import authCtrl from '../controllers/auth.controller.js'
//import { get } from 'lodash'

const router = express.Router()


router.route('/api/newsletter')
    .post(newsletterCtrl.create)
    .get(newsletterCtrl.list)

router.route('/api/newsletter/:id')
    .delete(newsletterCtrl.remove)

router.param('id', newsletterCtrl.listPostById);

export default router  