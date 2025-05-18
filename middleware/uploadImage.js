const multer = require("multer");
const path = require("path");

module.exports = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) =>
      cb(null, path.join(process.cwd(), "public", "uploads")),
    filename: (_req, file, cb) =>
      cb(null, `${Date.now()}_${file.originalname.replace(/\s+/g, "")}`),
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});
