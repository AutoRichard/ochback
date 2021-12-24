import express from 'express'
import linkCtrl from '../controllers/link.controller'
import authCtrl from '../controllers/auth.controller.js'
//import { get } from 'lodash'

const router = express.Router()


router.route('/api/links')
    .get(linkCtrl.list)
    .post(linkCtrl.create)

router.route('/api/link/:linkId')
    .put(authCtrl.requireSignin, linkCtrl.update)

router.route('/api/checkLink')
    .post(linkCtrl.count)

router.route('/api/linkAudio')
    .put(authCtrl.requireSignin, linkCtrl._postAudio)
    .delete(authCtrl.requireSignin, linkCtrl._deleteAudio);

router.route('/api/linkVideo')
    .put(authCtrl.requireSignin, linkCtrl._postVideo)
    .delete(authCtrl.requireSignin, linkCtrl._deleteVideo);



router.param('linkId', linkCtrl.linkByID);

//router.param('linkUserID', linkCtrl.linkByUserId)

export default router  
