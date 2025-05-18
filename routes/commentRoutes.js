const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const commentController = require("../controllers/commentController");

// creates a new comment
router.post("/:postId/comments", auth, commentController.createComment);

// lists comments based on post
router.get("/:postId/comments", commentController.listComments);

// deletes a comment - (permitted only for comment owner)
router.delete("/comments/:id", auth, commentController.deleteComment);

module.exports = router;
