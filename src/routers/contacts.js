import express, { Router } from 'express';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import {
  getAllContactsController,
  getContactByIdController,
  createContactController,
  updateContactController,
  putContactController,
  deleteContactController,
} from '../controllers/contacts.js';
import isValidId from '../middlewares/isValidId.js';
import validateBody from '../middlewares/validateBody.js';
import { createContactShema, updateContactShema } from '../validation/contacts.js';
import authenticate from '../middlewares/authenticate.js';
import upload from '../middlewares/upload.js';

const router = Router();
const jsonParser = express.json();

router.use(authenticate);

router.get('/', ctrlWrapper(getAllContactsController));

router.get('/:id', isValidId, ctrlWrapper(getContactByIdController));

router.post(
  '/',
  jsonParser,
  upload.single('photo'),
  validateBody(createContactShema),
  ctrlWrapper(createContactController)
);

router.patch(
  '/:id',
  isValidId,
  jsonParser,
  upload.single('photo'),
  validateBody(updateContactShema),
  ctrlWrapper(updateContactController)
);

router.put(
  '/:id',
  isValidId,
  jsonParser,
  upload.single('photo'),
  validateBody(createContactShema),
  ctrlWrapper(putContactController)
);

router.delete('/:id', isValidId, ctrlWrapper(deleteContactController));

export default router;
