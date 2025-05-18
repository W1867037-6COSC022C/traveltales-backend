const { run, get } = require("../config/database");

/**
 *
 * @param {int} userId
 * @param {int} postId
 * @param {boolean} isLike
 * insert/ updates a user’s like/dislike on a post.
 * when a like/dislike already exists- updates the is_like and timestamp.
 */
const likeDislikePost = async (userId, postId, isLike) => {
  const sql = `
    INSERT INTO post_votes (user_id, post_id, is_like)
    VALUES (?, ?, ?)
    ON CONFLICT(user_id, post_id)
    DO UPDATE SET
      is_like    = excluded.is_like,
      created_at = CURRENT_TIMESTAMP
  `;
  return run(sql, [userId, postId, isLike ? 1 : 0]);
};

/**
 *
 * @param {int} userId
 * @param {int} postId
 * removes user's like
 */
const removeInterationForPost = async (userId, postId) => {
  const sql = `
    DELETE FROM post_votes
    WHERE user_id = ? AND post_id = ?
  `;
  return run(sql, [userId, postId]);
};

/**
 *
 * @param {int} postId
 *counts likes and dislikes count for a given post
 */
const countTotalLikesDislikes = async (postId) => {
  const sql = `
    SELECT
      SUM(CASE WHEN is_like=1 THEN 1 ELSE 0 END) AS likes,
      SUM(CASE WHEN is_like=0 THEN 1 ELSE 0 END) AS dislikes
    FROM post_votes
    WHERE post_id = ?
  `;
  const row = await get(sql, [postId]);
  return {
    likes: row.likes || 0,
    dislikes: row.dislikes || 0,
  };
};

/**
 *
 * @param {int} userId
 * @param {int} postId
 * retrieves whether the user interacted with a like or an dislike for a given post
 * like -> true
 * dislike -> false
 * no interaction -> null
 */
const getUserInteractionType = async (userId, postId) => {
  const sql = `
    SELECT is_like
    FROM post_votes
    WHERE user_id = ? AND post_id = ?
  `;
  const row = await get(sql, [userId, postId]);
  return row ? Boolean(row.is_like) : null;
};

module.exports = {
  likeDislikePost,
  removeInterationForPost,
  countTotalLikesDislikes,
  getUserInteractionType,
};
