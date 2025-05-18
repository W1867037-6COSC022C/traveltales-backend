const LikeDislikeDao = require("../dao/LikesDislikesDAO");

/**
 * records each likes added to a given post
 */
const addLike = (userId, postId) =>
  LikeDislikeDao.likeDislikePost(userId, postId, true);

/**
 * records each dislikes added to a given post
 */
const addDislike = (userId, postId) =>
  LikeDislikeDao.likeDislikePost(userId, postId, false);

/**
 * remove the interaction done (like/ dislike) by a user
 */
const removeInteraction = (userId, postId) =>
  LikeDislikeDao.removeInterationForPost(userId, postId);

/**
 * retrieves total count of likes & dislikes for given post.
 */
const getTotalCountOfLikeDislikes = (postId) =>
  LikeDislikeDao.countTotalLikesDislikes(postId);

/**
 * retrieves the type of interation (like, dislike, none) type
 */
const getUserInteractionType = (userId, postId) =>
  LikeDislikeDao.getUserInteractionType(userId, postId);

module.exports = {
  addLike,
  addDislike,
  removeInteraction,
  getTotalCountOfLikeDislikes,
  getUserInteractionType,
};
