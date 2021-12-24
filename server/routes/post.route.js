import express from 'express'
import postCtrl from '../controllers/post.controller'
//import authCtrl from '../controllers/auth.controller.js'
//import { get } from 'lodash'

const router = express.Router()


router.route('/api/post')
    .post(postCtrl.create)
    .get(postCtrl.list)

router.route('/api/post/:userId')
    .get(postCtrl.read)

router.route('/api/postComment')
    .post(postCtrl._postComment)


router.route('/api/photo/:id')
    .get(postCtrl.photo)

router.route('/api/singlepost/:id')
    .delete(postCtrl.remove)

router.param('id', postCtrl.listPostById);

router.param('userId', postCtrl.listPostByUser);


export default router  