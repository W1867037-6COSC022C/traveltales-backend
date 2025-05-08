module.exports = (err, _req, res, _next) => {
  console.error(err);
  res
    .status(err.statusCode || 500)
    .json({ error: err.message || "Server error" });
};
