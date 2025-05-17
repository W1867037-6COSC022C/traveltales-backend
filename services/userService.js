const bcrypt = require("bcrypt");
const userDao = require("../dao/userDAO");
const { signToken } = require("../utils/jwtHelper");

/**
 * register a new user
 * Assumption: System has only one Admin, and the first user is always "Admin"
 * - returns an object with JWT token and the created user excluding password
 */
const register = async ({ username, email, password }) => {
  if (await userDao.findUserByEmail(email)) {
    const err = new Error("User already exists");
    err.status = 409;
    throw err;
  }

  const hash = await bcrypt.hash(password, 12);
  const role = (await userDao.countUsers()) === 0 ? 1 : 2;
  const user = await userDao.createUser({
    username,
    email,
    password: hash,
    role,
  });
  const token = signToken({ id: user.id, email: user.email, role: user.role });

  return { token, user };
};

/**
 * authenticate an existing user
 * returns an object with JWT token and user info excluding password
 */
const login = async ({ email, password }) => {
  const user = await userDao.findUserByEmail(email);
  if (!user) {
    const err = new Error("User not found");
    err.status = 401;
    throw err;
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    const err = new Error("Invalid credentials");
    err.status = 401;
    throw err;
  }

  const token = signToken({ id: user.id, email: user.email, role: user.role });
  const safeUser = {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
  };

  return { token, user: safeUser };
};

/**
 * Returns id, username, email, role, and creation timestamp of a selected profile
 */
const getProfile = async (userId) => {
  return userDao.findUserById(userId);
};

module.exports = {
  register,
  login,
  getProfile,
};
