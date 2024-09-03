import bcrypt from 'bcrypt';

const bcryptComparePassword = (password, userPassword) => bcrypt.compare(password, userPassword);

export default bcryptComparePassword;
