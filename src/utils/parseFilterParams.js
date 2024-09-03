import { KEY_CONTACT_TYPE } from '../constants/contacts.js';

const parseType = type => {
  if (typeof type !== 'string') return;

  const typeLowerCase = type.toLocaleLowerCase();

  if (
    [KEY_CONTACT_TYPE.home, KEY_CONTACT_TYPE.personal, KEY_CONTACT_TYPE.work].includes(
      typeLowerCase
    )
  )
    return typeLowerCase;
};

const parseIsFavourite = isFavourite => {
  if (isFavourite === 'true') return true;
  if (isFavourite === 'false') return false;
};

const parseFilterParams = query => {
  const { type, isFavourite } = query;

  const parsedType = parseType(type);
  const parsedIsFavourite = parseIsFavourite(isFavourite);

  return {
    type: parsedType,
    isFavourite: parsedIsFavourite,
  };
};

export default parseFilterParams;
