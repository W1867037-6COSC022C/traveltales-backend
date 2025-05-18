const likeDislikeService = require("../services/LikesDislikesService");
const { catchAsync } = require("../utils/errorHandler");

/**
 * returns post id, else null
 */
function getPostId(req, res) {
  const id = Number(req.params.postId);
  if (!Number.isInteger(id)) {
    res.status(400).json({ error: "Post Not Found" });
    return null;
  }
  return id;
}

/**
 * add like/ update like
 * returns 204 - no response if success
 */
const likePost = catchAsync(async (req, res) => {
  const postId = getPostId(req, res);
  if (postId === null) return;
  await likeDislikeService.addLike(req.user.id, postId);
  res.sendStatus(204);
});

/**
 * add dislike/ update dislike
 * returns 204 - no response if success
 */
const dislikePost = catchAsync(async (req, res) => {
  const postId = getPostId(req, res);
  if (postId === null) return;
  await likeDislikeService.addDislike(req.user.id, postId);
  res.sendStatus(204);
});

/**
 * remove any existing interaction
 * returns 204 - no response if success
 */
const removeInteraction = catchAsync(async (req, res) => {
  const postId = getPostId(req, res);
  if (postId === null) return;
  await likeDislikeService.removeInteraction(req.user.id, postId);
  res.sendStatus(204);
});

/**
 * retrieves total likes & dislikes for a given post.
 *
 */
const getCountOfLikesDislikes = catchAsync(async (req, res) => {
  const postId = getPostId(req, res);
  if (postId === null) return;
  const totals = await likeDislikeService.getTotalCountOfLikeDislikes(postId);
  res.json(totals);
});

/**
 * retrievest= the type of interation a user used for a post.
 *
 */
const getTypeOfInteractionByUser = catchAsync(async (req, res) => {
  const postId = getPostId(req, res);
  if (postId === null) return;
  const vote = await likeDislikeService.getUserInteractionType(
    req.user.id,
    postId
  );
  res.json({ vote });
});

module.exports = {
  likePost,
  dislikePost,
  removeInteraction,
  getCountOfLikesDislikes,
  getTypeOfInteractionByUser,
};
