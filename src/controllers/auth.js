import createHttpError from 'http-errors';
import {
  createSession,
  createUser,
  deleteSessionByUserId,
  deleteSessionById,
  findUserByEmail,
  findSessionByIdAdnRefToken,
  findUserByIdAndEmail,
  updateUserPassword,
} from '../services/auth.js';
import setupCookies from '../utils/setupCookies.js';
import clearCookies from '../utils/clearCookies.js';
import createJwtResetToken from '../utils/createJwtToken.js';
import sendEmail from '../utils/sendEmail.js';
import env from '../utils/env.js';
import decodedJwtToken from '../utils/decodedJwtToken.js';
import bcryptHashPassword from '../utils/bcryptHashPassword.js';
import bcryptHashRandomPassword from '../utils/bcryptHashRandomPassword.js';
import bcryptComparePassword from '../utils/bcryptComparePassword.js';
import { generateAuthUrl, validateCode } from '../utils/googleOAuth2.js';

export const registerUserController = async (req, res, next) => {
  const { email, name, password } = req.body;

  const emailIsAvailable = await findUserByEmail(email);

  if (emailIsAvailable !== null) {
    throw createHttpError(409, 'Email in use');
  }

  const createHashPassword = await bcryptHashPassword(password);

  const user = {
    name,
    email,
    password: createHashPassword,
  };

  await createUser(user);

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

  const isPasswordCorrect = await bcryptComparePassword(password, user.password);

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

  const user = await findUserByEmail(email);

  if (user === null) {
    throw createHttpError(404, 'User not found!');
  }

  const resetToken = createJwtResetToken({
    id: user._id,
    email,
  });

  try {
    await sendEmail({
      from: env('SMTP_FROM'),
      to: email,
      subject: 'Reset your password',
      html: `<p>Click <a href="${env(
        'APP_DOMAIN'
      )}/reset-password?token=${resetToken}">here</a> to reset your password!</p>`,
    });
  } catch (error) {
    console.log(error);
    throw createHttpError(500, 'Failed to send the email, please try again later.');
  }

  res.status(200).json({
    status: 200,
    message: 'Reset password email has been successfully sent.',
    data: {},
  });
};

export const resetPasswordController = async (req, res, next) => {
  const { token, password } = req.body;
  let id, email;

  try {
    ({ id, email } = decodedJwtToken(token));
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError')
      throw createHttpError(401, 'Token is expired or invalid.');

    throw error;
  }

  const user = await findUserByIdAndEmail({ _id: id, email });

  if (user === null) throw createHttpError(404, 'User not found!');

  const newHashPassword = await bcryptHashPassword(password);

  await Promise.all([
    updateUserPassword({ _id: id, password: newHashPassword }),
    deleteSessionByUserId(id),
  ]);

  clearCookies(res);

  res.status(200).json({
    status: 200,
    message: 'Password has been successfully reset.',
    data: {},
  });
};

export const getGoogleOAuthUrlController = (req, res, next) => {
  const url = generateAuthUrl();

  res.status(200).json({
    status: 200,
    message: 'Successfully get Google OAuth url!',
    data: {
      url,
    },
  });
};

export const loginWithGoogleController = async (req, res, next) => {
  const { code } = req.body;
  const ticket = await validateCode(code);
  const payload = ticket.getPayload();

  if (!payload) throw createHttpError(401, 'Unauthorized');

  const { name, email } = payload;
  let user = await findUserByEmail(email);

  if (user === null) {
    const password = await bcryptHashRandomPassword();
    const newUser = {
      name,
      email,
      password,
    };

    user = await createUser(newUser);
  }

  await deleteSessionByUserId(user._id);
  const session = await createSession(user._id);

  setupCookies(res, session);

  res.status(200).json({
    status: 200,
    message: 'Successfully logged in via Google OAuth!',
    data: {
      accessToken: session.accessToken,
    },
  });
};
