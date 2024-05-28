const express = require("express");
const { getTopics } = require("./controllers/topics.controller");

const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.use((err, req, res, next) => {
  res.status(404).send({ msg: "Not Found" });
  next(err);
});

module.exports = app;
