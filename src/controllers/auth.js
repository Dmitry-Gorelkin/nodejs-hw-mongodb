import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import {
  createSession,
  createUser,
  deleteSessionByUserId,
  deleteSessionById,
  findUserByEmail,
  findSessionByIdAdnToken,
} from '../services/auth.js';
import setupCookies from '../utils/setupCookies.js';
import clearCookies from '../utils/clearCookies.js';

export const registerUserController = async (req, res, next) => {
  const { email, name } = req.body;

  const emailIsAvailable = await findUserByEmail(email);

  if (emailIsAvailable !== null) {
    throw createHttpError(409, 'Email in use');
  }

  await createUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: { name, email },
  });
};

export const loginUserController = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await findUserByEmail(email);

  if (user === null) throw createHttpError(401, 'Email is not registered');

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) throw createHttpError(401, 'Password is incorrect');

  await deleteSessionByUserId(user._id);

  const session = await createSession(user._id);

  setupCookies(res, session);

  res.status(200).json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: { accessToken: session.accessToken },
  });
};

export const logoutUserController = async (req, res, next) => {
  const { sessionId } = req.cookies;

  if (sessionId) await deleteSessionById(sessionId);

  clearCookies(res);

  res.sendStatus(204);
};

export const refreshUserSessionController = async (req, res, next) => {
  const refreshSession = await findSessionByIdAdnToken(req.cookies);

  if (refreshSession === null) {
    clearCookies(res);
    throw createHttpError(401, 'Unauthorized');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: 'accessToken',
  });
};
