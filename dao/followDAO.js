const { run, all } = require("../config/database");

module.exports = {
  /**
   * follows a user
   * @param {int} uid
   * @param {int} targetId
   * @returns
   */
  followUser: (uid, targetId) =>
    run(`INSERT OR IGNORE INTO follows(follower_id,following_id) VALUES(?,?)`, [
      uid,
      targetId,
    ]),

  /**
   * removes a user from following
   * @param {int} uid
   * @param {int} targetId
   * @returns
   */
  unfollowUser: (uid, targetId) =>
    run(`DELETE FROM follows WHERE follower_id=? AND following_id=?`, [
      uid,
      targetId,
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
};
