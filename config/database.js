require("dotenv").config();
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = process.env.DATABASE_FILE || "./traveltales.db";

const db = new sqlite3.Database(dbPath, (err) =>
  err
    ? console.error("SQLite Database Error: ", err.message)
    : console.log("SQLite DB Connection Established: ", dbPath)
);

db.serialize(() => {
  db.run("PRAGMA foreign_keys = ON;");
  db.run(`CREATE TABLE IF NOT EXISTS users(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL UNIQUE,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            role INTEGER NOT NULL DEFAULT 2,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          );`);
  db.run(`CREATE TABLE IF NOT EXISTS posts(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            author_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            country TEXT NOT NULL,
            visit_date DATE NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(author_id) REFERENCES users(id)
          );`);
  db.run(`CREATE TABLE IF NOT EXISTS images(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            post_id INTEGER NOT NULL,
            image_url TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(post_id) REFERENCES posts(id) ON DELETE CASCADE
          );`);
  db.run(`CREATE TABLE IF NOT EXISTS follows(
            follower_id INTEGER NOT NULL,
            following_id INTEGER NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY(follower_id, following_id),
            FOREIGN KEY(follower_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY(following_id) REFERENCES users(id) ON DELETE CASCADE
          );`);
  db.run(`CREATE TABLE IF NOT EXISTS post_votes(
            user_id INTEGER NOT NULL,
            post_id INTEGER NOT NULL,
            is_like BOOLEAN NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY(user_id, post_id),
            FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY(post_id) REFERENCES posts(id) ON DELETE CASCADE
          );`);
  db.run(`CREATE TABLE IF NOT EXISTS post_comments(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            post_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            content TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(post_id) REFERENCES posts(id) ON DELETE CASCADE,
            FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
          );`);
  db.run(`CREATE TABLE IF NOT EXISTS user_roles_def(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  role_type TEXT NOT NULL
);`);

  db.run(
    `INSERT OR IGNORE INTO user_roles_def VALUES (1, 'Admin'), (2, 'User')`,
    (err) => {
      if (err) {
        console.error("Error Occured: " + err);
      } else {
        console.log("Wrote to user_roles_def");
      }
    }
  );
});

const run = (sql, params = []) =>
  new Promise((res, rej) =>
    db.run(sql, params, function (e) {
      e ? rej(e) : res(this);
    })
  );
const get = (sql, params = []) =>
  new Promise((res, rej) =>
    db.get(sql, params, (e, row) => (e ? rej(e) : res(row)))
  );
const all = (sql, params = []) =>
  new Promise((res, rej) =>
    db.all(sql, params, (e, rows) => (e ? rej(e) : res(rows)))
  );

module.exports = { run, get, all };
