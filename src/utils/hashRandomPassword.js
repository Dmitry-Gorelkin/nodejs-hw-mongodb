import bcrypt from 'bcrypt';
import crypto from 'node:crypto';

const hashRandomPassword = () => bcrypt.hash(crypto.randomBytes(10), 10);

export default hashRandomPassword;
