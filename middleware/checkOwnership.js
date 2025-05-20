module.exports = (ownerId, currentUserId) => {
  if (ownerId !== currentUserId) {
    const err = new Error("Forbidden");
    err.statusCode = 403;
    throw err;
  }
};
