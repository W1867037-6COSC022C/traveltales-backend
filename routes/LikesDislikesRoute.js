const router = require("express").Router();
const LikesDislikesController = require("../controllers/LikesDislikesController");
const auth = require("../middleware/authMiddleware");

router.get("/:postId/votes", LikesDislikesController.getCountOfLikesDislikes);

//user-based
router.get(
  "/:postId/vote",
  auth,
  LikesDislikesController.getCountOfLikesDislikes
);
router.post("/:postId/like", auth, LikesDislikesController.likePost);
router.post("/:postId/dislike", auth, LikesDislikesController.dislikePost);
router.delete("/:postId/vote", auth, LikesDislikesController.removeInteraction);

module.exports = router;
