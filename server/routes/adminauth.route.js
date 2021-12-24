import express from 'express';
import adminCtrl from '../controllers/adminauth';

const router = express.Router()

router.route('/adminauth/signin')
  .post(adminCtrl.signin);
router.route('/adminauth/signout')
  .get(adminCtrl.signout);
 
export default router;