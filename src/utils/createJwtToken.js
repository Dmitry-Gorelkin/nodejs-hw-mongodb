import jwt from 'jsonwebtoken';
import env from './env.js';

const createJwtResetToken = ({ id, email }) =>
  jwt.sign(
    {
      id,
      email,
    },
    env('JWT_SECRET'),
    {
      expiresIn: '5m',
    }
  );

export default createJwtResetToken;
