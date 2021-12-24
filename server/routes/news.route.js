import express from 'express'
import newsCtrl from '../controllers/news.controller'
//import authCtrl from '../controllers/auth.controller.js'
//import { get } from 'lodash'

const router = express.Router()


router.route('/api/news')
    .post(newsCtrl.create)
    .get(newsCtrl.list)

router.route('/api/news/:id')
    .get(newsCtrl.read)
    .delete(newsCtrl.remove)
    
router.route('/api/newsPhoto/:id')
    .get(newsCtrl.photo)

router.param('id', newsCtrl.listPostById);

export default router  