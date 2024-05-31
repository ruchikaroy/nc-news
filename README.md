# News API

A CRUD api that lets the users query the database to create, read,update and delete data. All the endpoints have been tested for standard errors.

Here is the link for the hosted version (https://news-api-ibvn.onrender.com/api)

## How can you get this API

You can either fork this repository or clone it by running the below link on your own computer:

```
https://github.com/ruchikaroy/nc-news
```

## Installation requirements

1. You will need Node.js (at least version 12.5) and PostgreSQL (at least version 11.5) to run the project.
   Run the following in the command line to install all dependencies shown in the package.json:

```
 npm install
```

2. CREATING DATABASES FOR DEVELOPMENT AND TESTING ENVIRONMENTS

   You will have two databases in this project: one for real-looking dev data, and another for simpler test data. Please create two .env files for your project:

   - <code><b>_.env.test_ </b> </code> and <code><b>_.env.development_</b></code>
   - Into each, add PGDATABASE=, with the correct database name for that environment (see /db/setup.sql for the database names).
   - Double check that these .env files are .gitignored. These 2 files must be added in order to successfully connect to the two databases locally.

3. After this you will need to setup and seed the database by running the following commands:

```
npm run setup-dbs && npm run seed
```

4. Running the tests

   To run the main tests run the following command:

```
npm test
```

There are also tests for the utility functions that can be run with the following command:

```
npm run dev
```

## Built With

- [Node](https://nodejs.org/en/) - JavaScript runtime
- [Express](https://expressjs.com/) - web framework for Node
- [PostgreSQL](https://www.postgresql.org/) - relational database
- [node-postgres](https://node-postgres.com/) - node.js modules for interfacing with PostgreSQL database

## For testing

- [supertest](https://www.npmjs.com/package/supertest) - npm package that allows us to run tests against our server endpoints
- [jest](https://jestjs.io/docs/getting-started) - JavaScript testing framework
- [intellisense](https://code.visualstudio.com/docs/editor/intellisense) - VS Code tool

## Project By

[**Ruchika Roy**] (https://github.com/ruchikaroy)

---
