import createHttpError from 'http-errors';
import { findSessionByAccessToken, findUserById } from '../services/auth.js';

const authenticate = async (req, res, next) => {
  const accessToken = req.get('Authorization');

  if (!accessToken) {
    next(createHttpError(401, 'Please provide Authorization header'));
    return;
  }

  const [bearer, token] = accessToken.split(' ', 2);

  if (bearer !== 'Bearer' || !token) {
    next(createHttpError(401, 'Auth header should be of type Bearer'));
    return;
  }

  const session = await findSessionByAccessToken(token);

  if (session === null) {
    next(createHttpError(401, 'Session not found'));
    return;
  }

  const { accessTokenValidUntil, userId } = session;

  if (new Date() > new Date(accessTokenValidUntil)) {
    next(createHttpError(401, 'Access token expired'));
    return;
  }

  const user = await findUserById(userId);

  if (user === null) {
    next(createHttpError(401, 'User not found'));
    return;
  }

  req.user = user;

  next();
};

export default authenticate;
