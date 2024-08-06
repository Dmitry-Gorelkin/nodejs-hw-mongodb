import createHttpError from 'http-errors';
import {
  createContact,
  deleteContact,
  getAllContacts,
  getContsctById,
  updateContact,
} from '../services/contacts.js';

export const getAllContactsController = async (req, res) => {
  const contacts = await getAllContacts();

  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;

  const contact = await getContsctById(contactId);

  if (!contact) throw createHttpError(404, 'Contact not found');

  res.json({
    status: 200,
    message: `Successfully found contact with id: ${contactId}!`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  const newContact = await createContact(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
};

export const patchContactController = async (req, res) => {
  const { contactId } = req.params;

  const patchContact = await updateContact(contactId, req.body);

  if (!patchContact) throw createHttpError(404, 'Contact not found');

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: patchContact,
  });
};

export const putContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const options = {
    new: true,
    upsert: true,
    includeResultMetadata: true,
    runValidators: true,
  };

  const contact = {
    name: req.body.name ? req.body.name : next(createHttpError(404, 'Contact not name')),
    phoneNumber: req.body.phoneNumber
      ? req.body.phoneNumber
      : next(createHttpError(404, 'Contact not phoneNumber')),
    email: req.body.email ? req.body.email : next(createHttpError(404, 'Contact not email')),
    contactType: req.body.contactType
      ? req.body.contactType
      : next(createHttpError(404, 'Contact not contactType')),
    isFavourite:
      req.body.isFavourite === undefined
        ? next(createHttpError(404, 'Contact not isFavourite'))
        : req.body.isFavourite,
  };

  const putContact = await updateContact(contactId, contact, options);

  if (putContact.lastErrorObject.updatedExisting) {
    res.status(200).json({
      status: 200,
      message: 'Successfully update a contact!',
      data: putContact,
    });
  }

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: putContact,
  });
};

export const deleteContactController = async (req, res) => {
  const { contactId } = req.params;

  const result = await deleteContact(contactId);

  if (!result) throw createHttpError(404, 'Contact not found');

  res.sendStatus(204);
};
