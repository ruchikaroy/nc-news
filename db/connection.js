const { Pool } = require("pg");
const ENV = process.env.NODE_ENV || "development";

const pathToEnvFile = `${__dirname}/../.env.${ENV}`;

require("dotenv").config({ path: pathToEnvFile });

const PGDATABASE = process.env.PGDATABASE;

console.log(`The node enviroment is ${ENV}`);
console.log(`The path is to ${pathToEnvFile}`);
console.log(`The database is ${PGDATABASE}`);

if (!process.env.PGDATABASE) {
  throw new Error("PGDATABASE not set");
}

module.exports = new Pool();
