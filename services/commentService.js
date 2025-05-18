const commentDao = require("../dao/commentDAO");
const createError = require("http-errors");

/**
 * adds a comment to a post.
 *
 */
const addComment = async (userId, postId, content) => {
  if (!content || !content.trim()) {
    throw createError(400, "Comment cannot be empty");
  }
  return commentDao.createComment(userId, postId, content.trim());
};

/**
 * lists all comments for a post.
 */
const listComments = (postId) => {
  return commentDao.getCommentsByPostId(postId);
};

/**
 * removes a comment - only the person who added is permitted to remove the same
 *
 */
const removeComment = async (userId, commentId) => {
  const comment = await commentDao.findCommentByCommentId(commentId);
  if (!comment) {
    throw createError(404, "Comment Not Found");
  }
  if (comment.user_id !== userId) {
    throw createError(403, "This comment has been added by another user");
  }
  return commentDao.deleteComment(commentId);
};

module.exports = {
  addComment,
  listComments,
  removeComment,
};
