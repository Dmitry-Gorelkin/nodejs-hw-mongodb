import createHttpError from 'http-errors';
import {
  createContact,
  deleteContact,
  getAllContacts,
  getContsctByIdAndUserId,
  updateContact,
} from '../services/contacts.js';
import parsePaginationParams from '../utils/parsePaginationParams.js';
import parseSortParams from '../utils/parseSortParams.js';
import parseFilterParams from '../utils/parseFilterParams.js';

export const getAllContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);
  const userId = req.user._id;

  const contacts = await getAllContacts({ page, perPage, sortBy, sortOrder, filter, userId });

  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res, next) => {
  const userId = req.user._id;
  const { id } = req.params;

  const contact = await getContsctByIdAndUserId(id, userId);

  if (!contact) throw createHttpError(404, 'Contact not found');

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id: ${id}!`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  const userId = req.user._id;
  const newContact = await createContact({ ...req.body, userId });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
};

export const updateContactController = async (req, res) => {
  const userId = req.user._id;
  const { id } = req.params;

  const patchContact = await updateContact(id, userId, req.body);

  if (!patchContact) throw createHttpError(404, 'Contact not found');

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: patchContact,
  });
};

export const putContactController = async (req, res, next) => {
  const userId = req.user._id;
  const { id } = req.params;
  const options = {
    new: true,
    upsert: true,
    includeResultMetadata: true,
    runValidators: true,
  };

  const putContact = await updateContact(id, userId, { ...req.body, userId }, options);

  if (putContact.lastErrorObject.updatedExisting) {
    res.status(200).json({
      status: 200,
      message: 'Successfully update a contact!',
      data: putContact.value,
    });

    return;
  }
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: putContact.value,
  });
};

export const deleteContactController = async (req, res) => {
  const userId = req.user._id;
  const { id } = req.params;

  const result = await deleteContact(id, userId);

  if (!result) throw createHttpError(404, 'Contact not found');

  res.sendStatus(204);
};
