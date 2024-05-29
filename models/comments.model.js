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

exports.insertComment = (body, username, article_id) => {
  return db
    .query(
      `INSERT INTO comments (body, author, article_id) VALUES ($1,$2,$3) RETURNING *;`,
      [body, username, article_id]
    )
    .then(({ rows }) => rows[0]);
};
