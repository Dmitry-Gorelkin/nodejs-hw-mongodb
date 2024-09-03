import bcrypt from 'bcrypt';

const bcryptHashPassword = password => bcrypt.hash(password, 10);

export default bcryptHashPassword;
