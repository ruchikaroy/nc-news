const express = require("express");
const { getTopics } = require("./controllers/topics.controller");
const endpoints = require("./endpoints.json");

const app = express();

app.use(express.json());

const getAPI = (req, res, next) => {
  res.status(200).send({ endpoints });
};

app.get("/api/topics", getTopics);

app.get("/api", getAPI);

app.use((err, req, res, next) => {
  res.status(404).send({ msg: "Not Found" });
  next(err);
});

module.exports = app;
