const { run, get, all } = require("../config/database");

/**
 * inserts a new post
 * @param {int} authorId
 * @param {country obj} param1
 * @returns
 */
const createPost = async (authorId, { title, content, country, visitDate }) => {
  const sql = `
    INSERT INTO posts (author_id, title, content, country, visit_date)
    VALUES (?, ?, ?, ?, ?)
  `;
  const { lastID } = await run(sql, [
    authorId,
    title,
    content,
    country,
    visitDate,
  ]);
  return lastID;
};

/**
 * updates an existing post
 * @param {int} id
 * @param {country obj} param1
 * @returns
 */
const updatePost = (id, { title, content, country, visitDate }) => {
  const sql = `
    UPDATE posts
    SET title      = ?,
        content    = ?,
        country    = ?,
        visit_date = ?
    WHERE id = ?
  `;
  return run(sql, [title, content, country, visitDate, id]);
};

/**
 * deletes a post based on id
 * @param {int} id
 * @returns the id of removed post
 */
const removePost = (id) => run(`DELETE FROM posts WHERE id = ?`, [id]);

/**
 *
 **/
/**
 * gets a post posted by user based on username and restricting post id
 * @param {int} id
 * @returns the id of the retrieved post
 */
const getPostById = (id) => {
  const sql = `
    SELECT p.*, u.username AS author
    FROM posts p
    JOIN users u ON u.id = p.author_id
    WHERE p.id = ?
  `;
  return get(sql, [id]);
};

/**
 * defining post listing with search / sort / pagination.
 **/
const listPosts = ({
  limit = 10,
  offset = 0,
  sortBy = "latest", // based on 'latest' | 'likes' | 'comments'
  search = "",
  type = "title", // based on 'title' | 'author' | 'country'
} = {}) => {
  let order = "p.created_at DESC";
  if (sortBy === "likes") order = "v.likes DESC";
  if (sortBy === "comments") order = "c.cnt  DESC";

  let where = "";
  const params = [];
  if (search) {
    const pat = `%${search}%`;
    if (type === "title") where = "WHERE p.title   LIKE ?";
    else if (type === "author") where = "WHERE u.username LIKE ?";
    else if (type === "country") where = "WHERE p.country LIKE ?";
    params.push(pat);
  }

  const sql = `
    SELECT
      p.*,
      u.username                     AS author,
      COALESCE(v.likes,0)            AS likes,
      COALESCE(v.dislikes,0)         AS dislikes,
      COALESCE(c.cnt,0)              AS comments
    FROM posts p
    JOIN users u ON u.id = p.author_id
    
    LEFT JOIN (
      SELECT post_id,
             SUM(CASE WHEN is_like=1 THEN 1 ELSE 0 END) AS likes,
             SUM(CASE WHEN is_like=0 THEN 1 ELSE 0 END) AS dislikes
      FROM post_votes
      GROUP BY post_id
    ) v ON v.post_id = p.id
   
    LEFT JOIN (
      SELECT post_id, COUNT(*) AS cnt
      FROM post_comments
      GROUP BY post_id
    ) c ON c.post_id = p.id
    ${where}
    ORDER BY ${order}
    LIMIT ? OFFSET ?
  `;
  params.push(limit, offset);
  return all(sql, params);
};

/**
 *
 */
const listPostByAuthors = async ({
  authorIds = [],
  limit = 10,
  offset = 0,
  sortBy = "latest",
  search = "",
  type = "title",
} = {}) => {
  if (authorIds.length === 0) return [];

  const placeholders = authorIds.map(() => "?").join(",");
  const params = [...authorIds];

  let order = "p.created_at DESC";
  if (sortBy === "likes") order = "v.likes DESC";
  if (sortBy === "comments") order = "c.cnt  DESC";

  let where = `WHERE p.author_id IN (${placeholders})`;
  if (search) {
    const pat = `%${search}%`;
    if (type === "title") where += " AND p.title   LIKE ?";
    else if (type === "author") where += " AND u.username LIKE ?";
    else if (type === "country") where += " AND p.country LIKE ?";
    params.push(pat);
  }

  const sql = `
    SELECT
      p.*,
      u.username                     AS author,
      COALESCE(v.likes,0)            AS likes,
      COALESCE(v.dislikes,0)         AS dislikes,
      COALESCE(c.cnt,0)              AS comments
    FROM posts p
    JOIN users u ON u.id = p.author_id

    LEFT JOIN (
      SELECT post_id,
             SUM(CASE WHEN is_like=1 THEN 1 ELSE 0 END) AS likes,
             SUM(CASE WHEN is_like=0 THEN 1 ELSE 0 END) AS dislikes
      FROM post_votes
      GROUP BY post_id
    ) v ON v.post_id = p.id

    LEFT JOIN (
      SELECT post_id, COUNT(*) AS cnt
      FROM post_comments
      GROUP BY post_id
    ) c ON c.post_id = p.id
    ${where}
    ORDER BY ${order}
    LIMIT ? OFFSET ?
  `;
  params.push(limit, offset);
  return all(sql, params);
};

module.exports = {
  createPost,
  updatePost,
  removePost,
  getPostById,
  listPosts,
  listPostByAuthors,
};
