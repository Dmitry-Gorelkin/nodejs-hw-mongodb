import { PAGE_DEFAULT, PERPAGE_DEFAULT } from '../constants/contacts.js';

const parseNumber = (number, defaultValue) => {
  if (typeof number !== 'string') return defaultValue;

  const persedNumber = parseInt(number);

  if (Number.isNaN(persedNumber)) return defaultValue;

  return persedNumber > 0 ? persedNumber : defaultValue;
};

const parsePaginationParams = query => {
  const { page, perPage } = query;

  const parsedPage = parseNumber(page, PAGE_DEFAULT);
  const parsedRerPage = parseNumber(perPage, PERPAGE_DEFAULT);

  return {
    page: parsedPage,
    perPage: parsedRerPage,
  };
};

export default parsePaginationParams;
