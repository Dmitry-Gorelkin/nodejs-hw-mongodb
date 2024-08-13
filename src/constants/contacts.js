export const PAGE_DEFAULT = 1;

export const PERPAGE_DEFAULT = 10;

export const SORT_ORDER = Object.freeze({
  ASC: 'asc',
  DESC: 'desc',
});

export const KEY_OF_CONTACT = Object.freeze([
  '_id',
  'name',
  'phoneNumber',
  'email',
  'contactType',
  'isFavourite',
  'createdAt',
  'updatedAt',
]);

export const KEY_CONTACT_TYPE = Object.freeze(['personal', 'work', 'home']);
