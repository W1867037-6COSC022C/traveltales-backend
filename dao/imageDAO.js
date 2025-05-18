const { run, get, all } = require("../config/database");

/**
 * records each images linked to a post
 */
const addImage = async (postId, image_url = "") => {
  const sql = `
    INSERT INTO images (post_id, image_url)
    VALUES (?, ?)
  `;
  const result = await run(sql, [postId, image_url]);
  return result.lastID;
};

/**
 * updates image url
 */
const updateImageUrl = (id, image_url) => {
  const sql = `
    UPDATE images
    SET image_url = ?
    WHERE id = ?
  `;
  return run(sql, [image_url, id]);
};

/**
 * returns an array of { id, image_url } for a given post
 */
const getImagesByPost = (postId) => {
  const sql = `
    SELECT id, image_url
    FROM images
    WHERE post_id = ?
    ORDER BY id
  `;
  return all(sql, [postId]);
};

/**
 * returns the number of images linked for a given post
 */
const getCountPerPost = async (postId) => {
  const sql = `
    SELECT COUNT(*) AS cnt
    FROM images
    WHERE post_id = ?
  `;
  const row = await get(sql, [postId]);
  return row.cnt;
};

module.exports = {
  addImage,
  updateImageUrl,
  getImagesByPost,
  getCountPerPost,
};
