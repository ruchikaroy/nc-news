const express = require("express");
const { getTopics } = require("./controllers/topics.controller");
const {
  getArticlesById,
  getAllArticles,
  patchByArticleId,
} = require("./controllers/articles.controller");
const {
  getCommentsByArticleId,
  postComment,
  deleteByCommentId,
} = require("./controllers/comments.controller");
const { getAllUsers } = require("./controllers/users.controller");
const { getAPI } = require("./controllers/get-api.controller");

const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticlesById);
app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.get("/api/users", getAllUsers);
app.post("/api/articles/:article_id/comments", postComment);
app.patch("/api/articles/:article_id", patchByArticleId);
app.delete("/api/comments/:comment_id", deleteByCommentId);
app.get("/api", getAPI);

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid input" });
  } else {
    next(err);
  }
});

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Route not found" });
});

module.exports = app;
