import { SORT_ORDER } from '../constants/contacts.js';
import { KEY_OF_CONTACT, KEY_OF_CONTACT_DEFAULT } from '../constants/contacts.js';

const parseSortBy = sortBy => {
  if (typeof sortBy !== 'string') return KEY_OF_CONTACT_DEFAULT;

  return KEY_OF_CONTACT.includes(sortBy) ? sortBy : KEY_OF_CONTACT_DEFAULT;
};

const parseSortOrder = sortOrder => {
  if (typeof sortOrder !== 'string') return SORT_ORDER.ASC;

  const sotrType = sortOrder.toLocaleLowerCase();

  return [SORT_ORDER.ASC, SORT_ORDER.DESC].includes(sotrType) ? sotrType : SORT_ORDER.ASC;
};

const parseSortParams = query => {
  const { sortBy, sortOrder } = query;

  const parsedSortBy = parseSortBy(sortBy);
  const parsedSortOrder = parseSortOrder(sortOrder);

  return {
    sortBy: parsedSortBy,
    sortOrder: parsedSortOrder,
  };
};

export default parseSortParams;
