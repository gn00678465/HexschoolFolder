import express from 'express';
import {
  signUpController,
  logInController,
  changePasswdController,
  getProfile,
  updateProfile
} from '../../controllers';
import { isAuth } from '../../utils';

const router = express.Router();

router.post('/log_in', logInController);

router.post('/sign_up', signUpController);

router.post('/change_passwd', isAuth, changePasswdController);

router.get('/profile', isAuth, getProfile);

router.patch('/profile', isAuth, updateProfile);

export default router;
