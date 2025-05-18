const commentService = require("../services/commentService");
const { catchAsync } = require("../utils/errorHandler");

/**
 * helper method - validation of post url
 *
 */
const parsePostId = (req, res) => {
  const postId = Number(req.params.postId);
  if (!Number.isInteger(postId)) {
    res.status(400).json({ error: "Post ID Not Found" });
    return null;
  }
  return postId;
};

/**
 * helper method - validate comment url
 *
 */
const parseCommentId = (req, res) => {
  const commentId = Number(req.params.commentId ?? req.params.id);
  if (!Number.isInteger(commentId)) {
    res.status(400).json({ error: "Comment ID Not Found" });
    return null;
  }
  return commentId;
};

/**
 * creats a comment
 */
const createComment = catchAsync(async (req, res) => {
  const postId = parsePostId(req, res);
  if (postId === null) return;

  const userId = req.user.id;
  const { content } = req.body;

  const comment = await commentService.addComment(userId, postId, content);
  res.status(201).json(comment);
});

/**
 * deletes a comment
 *
 */
const deleteComment = catchAsync(async (req, res) => {
  const commentId = parseCommentId(req, res);
  if (commentId === null) return;

  const userId = req.user.id;
  await commentService.removeComment(userId, commentId);
  res.sendStatus(204);
});

/**
 * retrieves comments for a specified post
 */
const listComments = catchAsync(async (req, res) => {
  const postId = parsePostId(req, res);
  if (postId === null) return;

  const comments = await commentService.listComments(postId);
  res.json(comments);
});

module.exports = {
  createComment,
  deleteComment,
  listComments,
};
