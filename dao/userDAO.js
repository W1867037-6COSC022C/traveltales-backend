const { run, get } = require("../config/database");

/**
 *
 * registers a user in the system
 */
async function createUser({ username, email, password, role }) {
  const sql = `
    INSERT INTO users (username, email, password, role)
    VALUES (?, ?, ?, ?)
  `;
  const result = await run(sql, [username, email, password, role]);
  return {
    id: result.lastID,
    username,
    email,
    role,
  };
}

/**
 * returns full details of a user looked up specifying Email
 */
function findUserByEmail(email) {
  const sql = `
    SELECT *
    FROM users
    WHERE email = ?
  `;
  return get(sql, [email]);
}

/**
 * returns id, username, email, role, created_at of a user looked up specifying id
 */
function findUserById(id) {
  const sql = `
    SELECT id, username, email, role, created_at
    FROM users
    WHERE id = ?
  `;
  return get(sql, [id]);
}

/**
 * returns the number of users registered in the system
 */
function countUsers() {
  const sql = `
    SELECT COUNT(*) AS cnt
    FROM users
  `;
  return get(sql).then((row) => row.cnt);
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  countUsers,
};
