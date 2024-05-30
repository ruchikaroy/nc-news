const {
  fetchCommentsByArticleId,
  insertComment,
  removeByCommentId,
} = require("../models/comments.model");
const { checkArticleExists } = require("../models/articles.model");


exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  let promises = [fetchCommentsByArticleId(article_id)];

  if (article_id) {
    promises.push(checkArticleExists(article_id));
  }
  Promise.all(promises)
    .then((resolvedPromises) => {
      const comments = resolvedPromises[0];
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  if (!username || !body) {
    return res.status(400).send({ msg: "Request missing mandatory params" });
  }

  checkArticleExists(article_id)
    .then(() => insertComment(body, username, article_id))
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.deleteByCommentId = (req, res, next) => {
  const { comment_id } = req.params;
  removeByCommentId(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};
