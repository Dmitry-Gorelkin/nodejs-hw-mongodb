import createHttpError from 'http-errors';
import { isValidObjectId } from 'mongoose';

const isValidId = (req, res, next) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) throw createHttpError(400, 'ID is not valid');

  next();
};

export default isValidId;
