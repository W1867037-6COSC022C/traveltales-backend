const { run, all, get } = require("../config/database");

module.exports = {
  /**
   * follows a user
   * @param {int} uid
   * @param {int} targeuserToBeFollowedId
   * @returns
   */
  followUser: (uid, userToBeFollowedId) =>
    run(`INSERT OR IGNORE INTO follows(follower_id,following_id) VALUES(?,?)`, [
      uid,
      userToBeFollowedId,
    ]),

  /**
   * removes a user from following
   * @param {int} uid
   * @param {int} userToBeUnfollowedId
   * @returns
   */
  unfollowUser: (uid, userToBeUnfollowedId) =>
    run(`DELETE FROM follows WHERE follower_id=? AND following_id=?`, [
      uid,
      userToBeUnfollowedId,
    ]),
  /**
   * retrieves following users list
   * @param {int} uid
   * @returns
   */
  getFollowingUser: (uid) =>
    all(
      `SELECT u.id,u.username
         FROM follows f JOIN users u ON u.id=f.following_id
        WHERE f.follower_id=?`,
      [uid]
    ),

  /**
   * retrieves followers of a user as a list
   * @param {int} uid
   * @returns
   */
  getListOfFollowers: (uid) =>
    all(
      `SELECT u.id,u.username
         FROM follows f JOIN users u ON u.id=f.follower_id
        WHERE f.following_id=?`,
      [uid]
    ),

  /** count how many people a user is following */
  countFollowing: (uid) =>
    get(`SELECT COUNT(*) AS cnt FROM follows WHERE follower_id = ?`, [
      uid,
    ]).then((r) => r.cnt),

  /** count how many followers the user has */
  countFollowers: (uid) =>
    get(`SELECT COUNT(*) AS cnt FROM follows WHERE following_id = ?`, [
      uid,
    ]).then((r) => r.cnt),
};
