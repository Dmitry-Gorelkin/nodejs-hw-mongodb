import express, { Router } from 'express';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import {
  getAllContactsController,
  getContactByIdController,
  createContactController,
  patchContactController,
  putContactController,
  deleteContactController,
} from '../controllers/contacts.js';

const router = Router();
const jsonParser = express.json();

router.get('/', ctrlWrapper(getAllContactsController));

router.get('/:contactId', ctrlWrapper(getContactByIdController));

router.post('/', jsonParser, ctrlWrapper(createContactController));

router.patch('/:contactId', jsonParser, ctrlWrapper(patchContactController));

router.put('/:contactId', jsonParser, ctrlWrapper(putContactController));

router.delete('/:contactId', ctrlWrapper(deleteContactController));

export default router;
