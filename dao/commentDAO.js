const { run, all, get } = require("../config/database");

/**
 * add a new comment to a post
 */
const createComment = async (userId, postId, content) => {
  const sql = `
    INSERT INTO post_comments (user_id, post_id, content)
    VALUES (?, ?, ?)
  `;
  const result = await run(sql, [userId, postId, content]);
  return { id: result.lastID, user_id: userId, post_id: postId, content };
};

/**
 * deletes a comment using its id
 */
const deleteComment = async (commentId) => {
  const sql = `DELETE FROM post_comments WHERE id = ?`;
  await run(sql, [commentId]);
  return { id: commentId };
};

/**
 * retrieves all comments for a post
 */
const getCommentsByPostId = async (postId) => {
  const sql = `
    SELECT
      c.id,
      c.content,
      c.created_at,
      u.id       AS user_id,
      u.username
    FROM post_comments c
    JOIN users u ON u.id = c.user_id
    WHERE c.post_id = ?
    ORDER BY c.created_at DESC
  `;
  return all(sql, [postId]);
};

/**
 * lookup a single comment by its ID, else return null
 */
const findCommentByCommentId = async (commentId) => {
  const sql = `SELECT * FROM post_comments WHERE id = ?`;
  return get(sql, [commentId]);
};

module.exports = {
  createComment,
  deleteComment,
  getCommentsByPostId,
  findCommentByCommentId,
};
