import { OAuth2Client } from 'google-auth-library';
import createHttpError from 'http-errors';
import env from './env.js';
import { GOOGLE_AUTH_REDIRECT_URIS } from '../constants/contacts.js';

const googleOAuthClient = new OAuth2Client({
  clientId: env('GOOGLE_AUTH_CLIENT_ID'),
  clientSecret: env('GOOGLE_AUTH_CLIENT_SECRET'),
  redirectUri: GOOGLE_AUTH_REDIRECT_URIS,
});

export const generateAuthUrl = () =>
  googleOAuthClient.generateAuthUrl({
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
  });

export const validateCode = async code => {
  try {
    const response = await googleOAuthClient.getToken(code);

    return googleOAuthClient.verifyIdToken({
      idToken: response.tokens.id_token,
    });
  } catch (error) {
    if (error.response && error.response.status >= 400 && error.response.status <= 499) {
      throw createHttpError(401, 'Unauthorized');
    } else {
      throw error;
    }
  }
};
