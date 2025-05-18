const router = require("express").Router();
const followController = require("../controllers/followController");
const auth = require("../middleware/authMiddleware");

router.post("/:userId/follow", auth, followController.followUser);
router.delete("/:userId/follow", auth, followController.unfollowUser);
router.get("/following", auth, followController.listFollowingUsers);
router.get("/:userId/followers", followController.listFollowers);

module.exports = router;
