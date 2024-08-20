import express, { Router } from 'express';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import validateBody from '../middlewares/validateBody.js';
import { createUserShema, loginUserShema } from '../validation/user.js';
import {
  registerUserController,
  loginUserController,
  logoutUserController,
  refreshUserSessionController,
} from '../controllers/auth.js';

const router = Router();
const jsonParser = express.json();

router.post(
  '/register',
  jsonParser,
  validateBody(createUserShema),
  ctrlWrapper(registerUserController)
);

router.post('/login', jsonParser, validateBody(loginUserShema), ctrlWrapper(loginUserController));

router.post('/logout', jsonParser, ctrlWrapper(logoutUserController));

router.post('/refresh', jsonParser, ctrlWrapper(refreshUserSessionController));

export default router;
