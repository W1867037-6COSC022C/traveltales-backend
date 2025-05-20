const userDao = require("../dao/userDAO");
const followDao = require("../dao/followDAO");
const postDao = require("../dao/postDAO");
const bcrypt = require("bcrypt");
const { signToken } = require("../utils/jwtHelper");

/* ---------- registration ---------- */
async function register({ username, email, password }) {
  if (await userDao.findUserByEmail(email)) {
    const err = new Error("User already exists");
    err.status = 409;
    throw err;
  }
  const hash = await bcrypt.hash(password, 12);
  const role = (await userDao.countUsers()) === 0 ? 1 : 2; // first user → admin
  const user = await userDao.createUser({
    username,
    email,
    password: hash,
    role,
  });
  const token = signToken({ id: user.id, email: user.email, role: user.role });
  return { token, user };
}

/* ---------- login ---------- */
async function login({ email, password }) {
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
}

/* ---------- enriched profile for the current user ---------- */
async function getDashboardProfile(userId) {
  const user = await userDao.findUserById(userId);
  if (!user) return null;

  /* COUNT followers & following, and SELECT only this user's posts */
  const [followers, following, posts] = await Promise.all([
    followDao.countFollowers(userId),
    followDao.countFollowing(userId),
    postDao.listPostByAuthors({ authorIds: [userId] }),
  ]);

  return { ...user, followers, following, posts };
}

module.exports = {
  register,
  login,
  getDashboardProfile,
};
