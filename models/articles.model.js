const db = require("../db/connection");

exports.fetchArticlesById = (id) => {
  let sqlQuery = `SELECT 
  articles.article_id,
  articles.title,
  articles.topic,
  articles.author,
  articles.created_at,
  articles.votes,
  articles.article_img_url, 
  articles.body,
  CAST(COUNT(comments.article_id) AS INT) AS comment_count
FROM 
  articles 
LEFT JOIN 
  comments 
ON 
  comments.article_id = articles.article_id 
WHERE 
  articles.article_id = $1
GROUP BY 
  articles.article_id`;

  return db
    .query(sqlQuery, [id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `Article with ${id} does not exist`,
        });
      }
      return rows[0];
    })
    .catch();
};

exports.fetchAllArticles = ({ topic, sort_by, direction }) => {
  let queryValues = [];

  let sqlQuery = ` SELECT
  articles.article_id,
  articles.title,topic,
  articles.author,
  articles.created_at,
  articles.votes,
  articles.article_img_url,
  CAST (COUNT (comments.article_id) AS INT) AS comment_count
  FROM articles
  LEFT JOIN comments ON comments.article_id = articles.article_id
  `;

  if (topic) {
    sqlQuery += ` WHERE articles.topic = $1`;
    queryValues.push(topic);
  }

  sqlQuery += ` GROUP BY articles.article_id`;

  if (sort_by) {
    let sort_by_criteria;
    if (sort_by === "comment_count") {
      sort_by_criteria = "articles.comment_count";
    } else if (sort_by === "created_at") {
      sort_by_criteria = "articles.created_at";
    } else if (sort_by === "votes") {
      sort_by_criteria = "articles.votes";
    }

    sqlQuery += ` ORDER BY ${sort_by_criteria}`;
  }

  if (direction) {
    sqlQuery += ` ${direction}`;
  }

  console.log(sqlQuery);

  return db.query(sqlQuery, queryValues).then(({ rows }) => {
    return rows;
  });
};

exports.checkArticleExists = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [article_id])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({
          status: 404,
          msg: `Article with ${article_id} not found`,
        });
      }
    });
};

exports.updateArticleById = (article_id, inc_votes) => {
  const sqlQuery = `
  UPDATE articles
  SET votes = votes + $1
  WHERE article_id = $2
  RETURNING *;
`;
  const queryValues = [inc_votes, article_id];
  return db.query(sqlQuery, queryValues).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: `Article with ${article_id} not found`,
      });
    }
    return rows[0];
  });
};
