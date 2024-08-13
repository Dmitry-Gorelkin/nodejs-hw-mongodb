import createHttpError from 'http-errors';
import { Contact } from '../db/models/contact.js';

export const getAllContacts = async ({ page, perPage, sortBy, sortOrder, filter }) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactsQuery = Contact.find();

  if (filter.type) {
    contactsQuery.where('contactType').equals(filter.type);
  }

  if (filter.isFavourite !== undefined) {
    contactsQuery.where('isFavourite').equals(filter.isFavourite);
  }

  const [count, contacts] = await Promise.all([
    Contact.find().merge(contactsQuery).countDocuments(),
    contactsQuery
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .exec(),
  ]);

  if (count === 0) {
    return {
      data: contacts,
      page,
      perPage,
      totalItems: count,
      totalPages: 0,
      hasPreviousPage: false,
      hasNextPage: false,
      sortBy,
      sortOrder,
      ...filter,
    };
  }
  const totalPages = Math.ceil(count / perPage);

  if (page > totalPages)
    throw createHttpError(400, 'The requested page exceeds the total number of pages');

  return {
    data: contacts,
    page,
    perPage,
    totalItems: count,
    totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: totalPages - page > 0,
    sortBy,
    sortOrder,
    ...filter,
  };
};

export const getContsctById = id => Contact.findById(id);

export const createContact = payload => Contact.create(payload);

export const updateContact = (id, update, options = { new: true }) =>
  Contact.findByIdAndUpdate(id, update, options);

export const validateContact = payload => Contact.validate(payload);

export const deleteContact = id => Contact.findByIdAndDelete(id);
