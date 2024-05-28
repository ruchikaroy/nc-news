const express = require("express");
const { getTopics } = require("./controllers/topics.controller");
const { getArticlesById } = require("./controllers/articles.controller");
const { getAPI } = require("./controllers/get-api.controller");

const app = express();

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticlesById);
app.get("/api", getAPI);

app.use((err, req, res, next) => {
  res.status(404).send({ msg: err.msg });
  next(err);
});

module.exports = app;
