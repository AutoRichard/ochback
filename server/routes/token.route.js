import express from 'express';
import tokenCtrl from '../controllers/token.controller';

const router = express.Router()

router.route('/api/signature')
  .post(tokenCtrl.signature)

router.route('/api/check')
  .get(tokenCtrl.check)

router.route('/api/home')
  .get(tokenCtrl.home)

router.route('/api/main')
  .get(tokenCtrl.main)

router.route('/api/createUser')
  .get(tokenCtrl.createUser)
  .post(tokenCtrl.createUsers)

router.route('/api/newToken')
  .get(tokenCtrl.newToken)



export default router
