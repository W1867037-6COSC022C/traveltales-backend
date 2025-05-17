require("dotenv").config();
const express = require("express");
const app = express();

/* routes */
app.use(express.json());
["./routes/authRoutes"].forEach((p) => app.use("/api", require(p)));

const PORT = process.env.PORT;
app.listen(PORT, () =>
  console.log(`Traveltales API ↠ http://localhost:${PORT}`)
);
