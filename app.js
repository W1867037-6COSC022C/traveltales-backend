require("dotenv").config();
const express = require("express");

const userRoutes = require("./routes/userRoutes");

const app = express();

/* routes */
app.use("/auth", userRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () =>
  console.log(`Traveltales API ↠ http://localhost:${PORT}`)
);
