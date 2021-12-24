import express from 'express'
import subscriptionCtrl from '../controllers/subscription.controller'
import authCtrl from '../controllers/auth.controller.js'
//import { get } from 'lodash'

const router = express.Router()


router.route('/api/subscription')
    .get(subscriptionCtrl.listProductAndPlan)
    .post(subscriptionCtrl.createCustomer)

router.route('/api/subsriber')
    .post(subscriptionCtrl.retrieveCustomer)

router.route('/api/usersub')
    .post(subscriptionCtrl.retrieveSubscription)

router.route('/api/subuser')
    .post(subscriptionCtrl.createAndChangeSubscription)
    .delete(subscriptionCtrl.deleteSubscription)

router.route('/api/payment')
    .post(subscriptionCtrl.retrievePayment)



router.route('/api/plan')
    .get(subscriptionCtrl.listPlan)

router.route('/api/product')
    .get(subscriptionCtrl.listProduct)






export default router  