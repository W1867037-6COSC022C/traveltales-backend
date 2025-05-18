const followDao = require("../dao/followDAO");

/**
 *follows a new user - adds to profile
 * @param {int} followerId
 * @param {int} userToBeFollowedId
 */
const followUser = async (followerId, userToBeFollowedId) => {
  await followDao.followUser(followerId, userToBeFollowedId);
};

/**
 * unfollows a following user from profile
 * @param {int} followerId
 * @param {int} userToBeUnfollowedId
 */
const unfollowUser = async (followerId, userToBeUnfollowedId) => {
  await followDao.unfollowUser(followerId, userToBeUnfollowedId);
};

/**
 *
 * @param {int} userId
 * @returns list of users being followed by specified user
 */
const getFollowingUserList = async (userId) => {
  return followDao.getFollowingUser(userId);
};

/**
 *
 * @param {int} userId
 * @returns list of users who follows the specified user
 */
const getFollowersList = async (userId) => {
  return followDao.getListOfFollowers(userId);
};

module.exports = {
  followUser,
  unfollowUser,
  getFollowingUserList,
  getFollowersList,
};
