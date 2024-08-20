import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { User } from '../db/models/user.js';
import { Session } from '../db/models/session.js';

export const findUserByEmail = email => User.findOne({ email });

export const findUserById = id => User.findById(id);

export const createUser = async user => {
  user.password = await bcrypt.hash(user.password, 10);

  await User.create(user);
};

export const createSession = userId =>
  Session.create({
    userId,
    accessToken: randomBytes(30).toString('base64'),
    refreshToken: randomBytes(30).toString('base64'),
    accessTokenValidUntil: Date.now() + 1000 * 60 * 15,
    refreshTokenValidUntil: Date.now() + 1000 * 60 * 60 * 24 * 30,
  });

export const deleteSessionByUserId = userId => Session.findOneAndDelete({ userId });

export const deleteSessionById = id => Session.findByIdAndDelete(id);

export const findSessionByIdAdnRefToken = ({ refreshToken, sessionId }) =>
  Session.findOne({
    _id: sessionId,
    refreshToken,
  });

export const findSessionByAccessToken = accessToken => Session.findOne({ accessToken });
