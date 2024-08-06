import createHttpError from 'http-errors';
import {
  createContact,
  deleteContact,
  getAllContacts,
  getContsctById,
  validateContact,
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

  const contact = await validateContact(req.body);

  const putContact = await updateContact(contactId, contact, options);

  if (putContact.lastErrorObject.updatedExisting) {
    res.status(200).json({
      status: 200,
      message: 'Successfully update a contact!',
      data: putContact,
    });

    return;
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
