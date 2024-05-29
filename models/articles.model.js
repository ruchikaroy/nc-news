const db = require("../db/connection");

exports.fetchArticlesById = (id) => {
  let sqlQuery = `SELECT * FROM articles`;

  const queryValues = [];

  if (id) {
    sqlQuery += ` WHERE article_id = $1`;
    queryValues.push(id);
  }

  return db
    .query(sqlQuery, queryValues)
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
exports.fetchAllArticles = () => {
  sqlQuery = ` SELECT 
  articles.article_id,
  articles.title,topic,
  articles.author,
  articles.created_at,
  articles.votes,
  articles.article_img_url, 
  CAST (COUNT (comments.article_id) AS INT) AS comment_count
  FROM articles
  LEFT JOIN comments ON comments.article_id = articles.article_id
  GROUP BY articles.article_id
  ORDER BY articles.created_at DESC`;

  return db.query(sqlQuery).then(({ rows }) => {
    return rows;
  });
};
