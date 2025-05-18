const followService = require("../services/followService");
const { catchAsync } = require("../utils/errorHandler");

/**
 * follows a user by specified user
 */
const followUser = catchAsync(async (req, res) => {
  const userToBeFollowedId = Number(req.params.userId);
  if (!Number.isInteger(userToBeFollowedId)) {
    return res.status(400).json({ error: "User to be Followed Not Found" });
  }
  await followService.followUser(req.user.id, userToBeFollowedId);
  res.sendStatus(204);
});

/**
 * unfollows a user by specified user
 */
const unfollowUser = catchAsync(async (req, res) => {
  const userToBeUnfollowwedId = Number(req.params.userId);
  if (!Number.isInteger(userToBeUnfollowwedId)) {
    return res.status(400).json({ error: "User to be Unfollowed Not Found" });
  }
  await followService.unfollowUser(req.user.id, userToBeUnfollowwedId);
  res.sendStatus(204);
});

/**
 * get list of following users
 */
const listFollowingUsers = catchAsync(async (req, res) => {
  const list = await followService.getFollowingUserList(req.user.id);
  res.json(list);
});

/**
 * get list of followers of a specified user account
 */
const listFollowers = catchAsync(async (req, res) => {
  const userId = req.params.userId ? Number(req.params.userId) : req.user.id;
  if (!Number.isInteger(userId)) {
    return res.status(400).json({ error: "User Not Found" });
  }
  const list = await followService.getFollowersList(userId);
  res.json(list);
});

module.exports = {
  followUser,
  unfollowUser,
  listFollowingUsers,
  listFollowers,
};
