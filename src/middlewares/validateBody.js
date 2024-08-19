import createHttpError from 'http-errors';

const validateBody = shema => async (req, res, next) => {
  try {
    await shema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    next(createHttpError(400, error.details.map(err => err.message).join(', ')));
  }
};

export default validateBody;
