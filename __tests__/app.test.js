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

beforeEach(() => seed({ topicData, articleData, commentData, userData }));
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
  it("status:200 responds with a json representation of all the available endpoints of the api", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(
          expect.objectContaining({
            "GET /api": expect.objectContaining({
              description: expect.any(String),
            }),
            "GET /api/topics": expect.objectContaining({
              description: expect.any(String),
              queries: expect.any(Array),
              exampleResponse: expect.any(Object),
            }),
            "GET /api/articles": expect.objectContaining({
              description: expect.any(String),
              queries: expect.any(Array),
              exampleResponse: expect.any(Object),
            }),
          })
        );
      });
  });
});
