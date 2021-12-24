import express from 'express'
import linkCtrl from '../controllers/link.controller'
//import { get } from 'lodash'

const router = express.Router()

router.route('/api/linkthumbnail/:linkId')
    .get(linkCtrl.photo)

router.param('linkId', linkCtrl.linkByVideoId)

export default router  
