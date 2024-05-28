const {
  topicData,
  articleData,
  commentData,
  userData,
} = require("../db/data/test-data/index");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const app = require("../app");
const request = require("supertest");
const endpoints = require("../endpoints.json");

beforeEach(() =>
  seed({ topicData, articleData, commentData, userData, endpoints })
);
afterAll(() => db.end());

describe("/api/topics", () => {
  test("GET:200 sends an array of topics to the client", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            description: expect.any(String),
            slug: expect.any(String),
          });
        });
      });
  });
  test("GET api/topics should return 404 for non-existent endpoint ", () => {
    return request(app)
      .get("/api/non-existent endpoint")
      .expect(404)
      .then((response) => {
        expect(response.status).toBe(404);
      });
  });
});

describe("/api", () => {
  test("GET status:200 responds with a json representation of all the available endpoints of the api", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints: actualEndpoints } }) => {
        expect(actualEndpoints).toEqual(endpoints);
      });
  });
});

describe("/api/articles/:article=id", () => {
  test("GET:200 should respond with article for specified id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toMatchObject({
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
        });
      });
  });
  test("GET:404 sends an appropriate status and error message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then((response) => {
        expect(response.status).toBe(404);
        expect(response.body.msg).toBe("Article with 999 does not exist");
      });
  });
});
