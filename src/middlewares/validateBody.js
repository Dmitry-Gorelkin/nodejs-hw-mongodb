import createHttpError from 'http-errors';

const validateBody = shema => {
  return (req, res, next) => {
    const validationResult = shema.validate(req.body, { abortEarly: false });

    if (typeof validationResult.error !== 'undefined')
      throw createHttpError(400, validationResult.error.details.map(err => err.message).join(', '));

    next();
  };
};

export default validateBody;
