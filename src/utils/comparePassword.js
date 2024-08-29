import bcrypt from 'bcrypt';

const comparePassword = (password, userPassword) => bcrypt.compare(password, userPassword);

export default comparePassword;
