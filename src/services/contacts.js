import { Contact } from '../db/models/contact.js';

export const getAllContacts = () => Contact.find();

export const getContsctById = id => Contact.findById(id);

export const createContact = payload => Contact.create(payload);

export const updateContact = (id, update, options = { new: true }) =>
  Contact.findByIdAndUpdate(id, update, options);

export const deleteContact = id => Contact.findByIdAndDelete(id);
