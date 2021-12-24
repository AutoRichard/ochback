import express from 'express'
import bookingCtrl from '../controllers/booking.controller'
import authCtrl from '../controllers/auth.controller.js'
//import { get } from 'lodash'

const router = express.Router()


router.route('/api/booking')
    .get(bookingCtrl.list)
    .post(bookingCtrl.create)

router.route('/api/checkBooking')
    .post(bookingCtrl.count)


router.route('/api/listBooking')
    .post(bookingCtrl.listBooking)


export default router  