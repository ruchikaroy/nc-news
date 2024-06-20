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
  const { topic, sort_by, direction } = req.query;

  fetchAllArticles({ topic: topic, sort_by: sort_by, direction: direction })
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

module.exports = {
  getArticlesById,
  getAllArticles,
  patchByArticleId,
};
