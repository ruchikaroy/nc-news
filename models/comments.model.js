const db = require("../db/connection");

exports.fetchCommentsByArticleId = (article_id) => {
  let sqlQuery = `SELECT * FROM comments`;

  const queryValues = [];

  if (article_id) {
    sqlQuery += ` WHERE article_id = $1 ORDER BY created_at DESC `;
    queryValues.push(article_id);
  }
  return db
    .query(sqlQuery, queryValues)
    .then(({ rows }) => {
      return rows;
    })
    .catch((err) => {
      console.error(`Error executing query: ${err.message}`);
      throw err;
    });
};
