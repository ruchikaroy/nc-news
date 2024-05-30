const {
  fetchArticlesById,
  fetchAllArticles,
  updateArticleById,
  fetchArticlesByTopic,
} = require("../models/articles.model");

const getArticlesById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticlesById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};
const getAllArticles = (req, res, next) => {
  const { topic } = req.query;
  fetchAllArticles(topic)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

const patchByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  updateArticleById(article_id, inc_votes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};
const getArticlesByTopic = (req, res, next) => {
  const { topic } = req.params;
  fetchArticlesByTopic(topic).then((topic) => {
    res.status(200).send({ topic });
  });
};
module.exports = {
  getArticlesById,
  getAllArticles,
  patchByArticleId,
  getArticlesByTopic,
};
