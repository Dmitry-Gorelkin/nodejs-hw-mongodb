import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import {
  createSession,
  createUser,
  deleteSessionByUserId,
  deleteSessionById,
  findUserByEmail,
  findSessionByIdAdnRefToken,
} from '../services/auth.js';
import setupCookies from '../utils/setupCookies.js';
import clearCookies from '../utils/clearCookies.js';
import createJwtResetToken from '../utils/createJwtToken.js';
import sendEmail from '../utils/sendEmail.js';
import env from '../utils/env.js';

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
  const refreshSession = await findSessionByIdAdnRefToken(req.cookies);

  if (refreshSession === null) {
    clearCookies(res);
    throw createHttpError(401, 'Session not found');
  }

  const { refreshTokenValidUntil, userId, _id } = refreshSession;

  if (new Date() > new Date(refreshTokenValidUntil)) {
    clearCookies(res);
    throw createHttpError(401, 'Session token expired');
  }

  const [session] = await Promise.all([createSession(userId), deleteSessionById(_id)]);

  setupCookies(res, session);

  res.status(200).json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: { accessToken: session.accessToken },
  });
};

export const requestResetEmailController = async (req, res, next) => {
  const { email } = req.body;

  console.log({ email });

  const user = await findUserByEmail(email);

  console.log('user');

  if (user === null) {
    throw createHttpError(404, 'User not found!');
  }

  const resetToken = createJwtResetToken({
    id: user._id,
    email,
  });

  console.log({ resetToken });

  try {
    await sendEmail({
      from: env('SMTP_FROM'),
      to: email,
      subject: 'Reset your password',
      html: `<p>Click <a href="${resetToken}">here</a> to reset your password!</p>`,
    });
  } catch (error) {
    console.log(error);

    throw createHttpError(555, error);
  }

  console.log('смотри почту');

  res.status(200).json({
    status: 200,
    message: 'Reset password email has been successfully sent.',
    data: {},
  });
};
