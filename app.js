const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

// const swaggerUi = require("swagger-ui-express");
// const swaggerDocument = require("./swagger");

require("dotenv").config();

const cookRouter = require("./routes/api/cookbooks");
const userRouter = require("./routes/api/users");
const commentRouter = require("./routes/api/comments");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 минута
  max: 500, // Максимум 1000 запросов с одного IP в течение 1 минуты
  message: "Too many requests from this IP, please try again after a minute",
});

app.use(limiter);

app.use(express.json());
app.use(express.static("public"));

app.use("/api/recipes", cookRouter);
app.use("/api/users", userRouter);
app.use("/api/comments", commentRouter);

// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

module.exports = app;
