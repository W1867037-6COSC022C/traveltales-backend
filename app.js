require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
require("./config/database");

const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerSpec = YAML.load(path.join(__dirname, "openapi.yaml"));

const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const followRoutes = require("./routes/followRoutes");
const LikesDislikesRoutes = require("./routes/LikesDislikesRoutes");
const commentRoutes = require("./routes/commentRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT;

app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:8080",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/auth", userRoutes);
app.use("/posts", postRoutes);
app.use("/follows", followRoutes);
app.use("/posts", LikesDislikesRoutes);
app.use("/posts", commentRoutes);

app.use(errorHandler);

app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`));
