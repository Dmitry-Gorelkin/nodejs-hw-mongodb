import jwt from 'jsonwebtoken';
import env from './env.js';

const decodedJwtToken = token => jwt.verify(token, env('JWT_SECRET'));

export default decodedJwtToken;
