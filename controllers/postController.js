const postService = require("../services/postService");
const { catchAsync } = require("../utils/errorHandler");

/**
 * lists available posts
 */
const listPosts = catchAsync(async (req, res) => {
  const {
    limit = "10",
    offset = "0",
    sortBy = "latest",
    search = "",
    type = "title",
  } = req.query;

  const filters = {
    limit: Number(limit),
    offset: Number(offset),
    sortBy,
    search,
    type,
  };

  const posts = await postService.listPosts(filters);
  res.json(posts);
});

/**
 * retrieves a post
 */
const getPost = catchAsync(async (req, res) => {
  const postId = Number(req.params.postId);
  const post = await postService.getPostById(postId);
  res.json(post);
});

/**
 * creates a post
 */
const createPost = catchAsync(async (req, res) => {
  const postId = await postService.createPost(req.user.id, req.body, req.files);
  res.status(201).json({ id: postId });
});

const updatePost = catchAsync(async (req, res) => {
  const postId = Number(req.params.postId);
  const updated = await postService.updatePost(
    req.user.id,
    postId,
    req.body,
    req.files
  );
  res.json(updated);
});

/**
 * deletes a post
 */
const deletePost = catchAsync(async (req, res) => {
  const postId = Number(req.params.postId);
  await postService.deletePost(req.user.id, postId);
  res.sendStatus(204);
});

/**
 * lists personalized posts for a profile
 */
const generateFeed = catchAsync(async (req, res) => {
  const {
    limit = "10",
    offset = "0",
    sortBy = "latest",
    search = "",
    type = "title",
  } = req.query;

  const filters = {
    limit: Number(limit),
    offset: Number(offset),
    sortBy,
    search,
    type,
  };

  const feed = await postService.listFeed(req.user.id, filters);
  res.json(feed);
});

module.exports = {
  listPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  generateFeed,
};
