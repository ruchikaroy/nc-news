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
