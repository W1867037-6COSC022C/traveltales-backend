const postDao = require("../dao/postDAO");
const imageDao = require("../dao/imageDAO");
const followDao = require("../dao/followDAO");
const fs = require("fs/promises");
const path = require("path");

const IMAGE_UPLOAD_DIRECTORY = path.join(__dirname, "../public/uploads");
const MAX_ALLOWED_IMAGES_PER_POST = 3;

/**
 *
 * moves an uploaded image into the uploads directory and record the relevent URL.
 */
async function persistImage(postId, file) {
  const imageId = await imageDao.addImage(postId);
  const ext = path.extname(file.originalname);
  const formattedImageName = `img-${imageId}${ext}`;
  await fs.rename(
    file.path,
    path.join(IMAGE_UPLOAD_DIRECTORY, formattedImageName)
  );
  await imageDao.updateImageUrl(imageId, `/uploads/${formattedImageName}`);
}

/**
 * creates a new post
 * returns the new post id
 */
async function createPost(authorId, dto, files = []) {
  if (files.length > MAX_ALLOWED_IMAGES_PER_POST) {
    throw new Error(
      `Only ${MAX_ALLOWED_IMAGES_PER_POST} images are allowed per post.`
    );
  }
  const postId = await postDao.createPost(authorId, dto);
  await Promise.all(files.map((f) => persistImage(postId, f)));
  return postId;
}

/**
 * updates an existing post
 * returns the updated record of post
 */
async function updatePost(authorId, postId, dto, files = []) {
  const post = await postDao.getPostById(postId);
  if (!post) {
    throw new Error("Failed to find a matching post");
  }
  if (post.author_id !== authorId) {
    throw new Error("Forbidden!");
  }
  const currentCount = await imageDao.getCountPerPost(postId);
  if (currentCount + files.length > MAX_ALLOWED_IMAGES_PER_POST) {
    throw new Error(
      `Post already has ${currentCount} images; Only ${MAX_ALLOWED_IMAGES_PER_POST} are allowed.`
    );
  }
  await postDao.updatePost(postId, dto);
  await Promise.all(files.map((f) => persistImage(postId, f)));
  return postDao.getPostById(postId);
}

/**
 * deletes a post
 */
async function deletePost(authorId, postId) {
  const post = await postDao.getPostById(postId);
  if (!post) {
    throw new Error("Failed to find a matching post");
  }
  if (post.author_id !== authorId) {
    throw new Error("Forbidden");
  }
  await postDao.removePost(postId);
}

/**
 * retrieves details of a given post
 */
async function getPostById(id) {
  const post = await postDao.byId(id);
  if (!post) {
    throw new Error("Failed to find a matching post");
  }
  const images = await imageDao.getImagesByPost(id);
  return { ...post, images };
}

/**
 * lists all posts with filters
 * filters are based on limit, offset, sortBy, search, and type
 */
async function listPosts(filters = {}) {
  return postDao.listPosts(filters);
}

/**
 * lists posts for a given user based on the user's following details
 */
async function listFeed(userId, filters = {}) {
  const rows = await followDao.getFollowingUser(userId);
  const authorIds = rows.map((r) => r.id);
  if (authorIds.length === 0) {
    return [];
  }
  return postDao.listPostByAuthors({ authorIds, ...filters });
}

module.exports = {
  createPost,
  updatePost,
  deletePost,
  getPostById,
  listPosts,
  listFeed,
};
