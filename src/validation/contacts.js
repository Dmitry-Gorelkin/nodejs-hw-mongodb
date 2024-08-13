import Joi from 'joi';
import { KEY_CONTACT_TYPE } from '../constants/contacts.js';

export const createContactShema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  phoneNumber: Joi.string().min(3).max(20).required(),
  email: Joi.string().email(),
  contactType: Joi.string()
    .valid(...KEY_CONTACT_TYPE)
    .required(),
  isFavourite: Joi.boolean(),
});

export const updateContactShema = Joi.object({
  name: Joi.string().min(3).max(20),
  phoneNumber: Joi.string().min(3).max(20),
  email: Joi.string().email(),
  contactType: Joi.string().valid(...KEY_CONTACT_TYPE),
  isFavourite: Joi.boolean(),
});
