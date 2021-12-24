import express from 'express'
import contactCtrl from '../controllers/contact.controller'
//import authCtrl from '../controllers/auth.controller.js'
//import { get } from 'lodash'

const router = express.Router()


router.route('/api/contact')
    .post(contactCtrl.create)
    .get(contactCtrl.list)

router.route('/api/contact/:id')
    .get(contactCtrl.read)
    .delete(contactCtrl.remove)


router.param('id', contactCtrl.listContactById);


export default router  