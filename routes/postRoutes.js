const router = require("express").Router();
const postController = require("../controllers/postController");
const auth = require("../middleware/authMiddleware");
const uploadImage = require("../middleware/uploadImage");

const MAX_ALLOWED_IMAGES_PER_POST = 3;

router.get("/feed", auth, postController.generateFeed);

router.get("/", postController.listPosts);
router.get("/:postId", postController.getPost);

router.post(
  "/",
  auth,
  uploadImage.array("images", MAX_ALLOWED_IMAGES_PER_POST),
  postController.createPost
);

router.put(
  "/:postId",
  auth,
  uploadImage.array("images", MAX_ALLOWED_IMAGES_PER_POST),
  postController.updatePost
);

router.delete("/:postId", auth, postController.deletePost);

module.exports = router;
