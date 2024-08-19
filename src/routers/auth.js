import express, { Router } from 'express';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import validateBody from '../middlewares/validateBody.js';
import { createUserShema } from '../validation/user.js';
import { registerUserController } from '../controllers/auth.js';

const router = Router();
const jsonParser = express.json();

router.post(
  '/register',
  jsonParser,
  validateBody(createUserShema),
  ctrlWrapper(registerUserController)
);

export default router;
