const bcrypt = require("bcryptjs");

const BCRYPT_SALT_ROUNDS = 10;

async function hashPassword(password) {
  return bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
}

async function comparePassword(plainPassword, hashedPassword) {
  return bcrypt.compare(plainPassword, hashedPassword);
}

module.exports = {
  BCRYPT_SALT_ROUNDS,
  hashPassword,
  comparePassword,
};
