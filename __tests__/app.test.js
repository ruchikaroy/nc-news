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

describe("GET/api/articles", () => {
  describe("/api/articles", () => {
    test("GET:200 should responds with an array of article objects", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toHaveLength(13);
          expect(articles).toBeInstanceOf(Array);
          articles.forEach((article) => {
            expect(article).toMatchObject({
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(Number),
            });
          });
        });
    });
    test("GET api/articles should return 404 for non-existent endpoint", () => {
      return request(app)
        .get("/api/bananana")
        .expect(404)
        .then((response) => {
          expect(response.status).toBe(404);
        });
    });
    test("GET:200 should responds with an array of article objects arranged in descending order", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toBeSortedBy("created_at", { descending: true });
        });
    });
  });
  describe("/api/articles/:article_id", () => {
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
    test("GET:400 sends an appropriate status and error message when given an invalid id", () => {
      return request(app)
        .get("/api/articles/not-an-id")
        .expect(400)
        .then((response) => {
          expect(response.status).toBe(400);
          expect(response.body.msg).toBe("Invalid input");
        });
    });
    test("GET:200 should respond with article for specified id and comment_count key added", () => {
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
            comment_count: expect.any(Number),
          });
          expect(article.comment_count).toBe(11);
        });
    });
  });
  describe("/api/articles/:article_id/comments", () => {
    test("GET:200 should respond with an array of comments sorted in descending order", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          const { comments } = body;
          expect(comments).toBeInstanceOf(Array);
          comments.forEach((comment) => {
            expect(comment).toMatchObject({
              body: expect.any(String),
              votes: expect.any(Number),
              author: expect.any(String),
              created_at: expect.any(String),
            });
          });
        });
    });
    test("GET:404 sends an appropriate status and error message when given a valid but non-existent id for comments", () => {
      return request(app)
        .get("/api/articles/999/comments")
        .expect(404)
        .then((response) => {
          expect(response.status).toBe(404);
          expect(response.body.msg).toBe("Article with 999 not found");
        });
    });
  });

  describe("GET: /api/articles?topic", () => {
    test("GET:200 should respond with the data for the specified topic when queried", () => {
      return request(app)
        .get("/api/articles?topic=cats")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles.length).toEqual(1);
          articles.forEach((article) => {
            expect(article.topic).toBe("cats");
          });
        });
    });
    test("GET: 200 should respond with all the articles if no topic is specified", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles.length).toBeGreaterThan(0);
          expect(articles.length).toBe(13);
        });
    });
  });
});

describe("POST:/api/articles/:article_id/comments", () => {
  test("POST:201 inserts a new comment to the db and sends the new comment back to the client", () => {
    const newComment = {
      username: "icellusedkars",
      body: "I love her",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            body: newComment["body"],
            article_id: 1,
            author: newComment["username"],
            votes: 0,
            created_at: expect.any(String),
          })
        );
      });
  });
  test("POST: 400 - returns bad request if missing required fields", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ username: "anything" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Request missing mandatory params");
      });
  });

  test("POST: 404 - returns not found if article does not exist", () => {
    return request(app)
      .post("/api/articles/9999/comments")
      .send({ username: "butter_bridge", body: "Great article!" })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article with 9999 not found");
      });
  });

  test("POST: 400 - returns bad request if invalid article_id is provided", () => {
    return request(app)
      .post("/api/articles/not-an-id/comments")
      .send({ username: "butter_bridge", body: "Great article!" })
      .expect(400);
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("PATCH:200 - increment the votes by votes_count", () => {
    return request(app)
      .patch("/api/articles/2")
      .send({ inc_votes: 10 })
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
        expect(article.votes).toEqual(10);
      });
  });

  test("PATCH: 404 - article not found", () => {
    return request(app)
      .patch("/api/articles/9999")
      .send({ inc_votes: 1 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article with 9999 not found");
      });
  });
});
describe("DELETE:/api/comments/:comment_id", () => {
  test("DELETE: 204 deletes the comment by the specified comment_id and sends back no body", () => {
    return request(app).delete("/api/comments/3").expect(204);
  });
  test("DELETE: 404 responds with an appropriate status and error msg when given a non-existent comment_id", () => {
    return request(app)
      .delete("/api/comments/999")
      .expect(404)
      .then((response) => {
        expect(response.status).toBe(404);
        expect(response.body.msg).toBe("Comment with 999 does not exist");
      });
  });
  test("DELETE:400 responds with an appropriate status and error msg when given an invalid comment_id", () => {
    return request(app)
      .delete("/api/comments/apple")
      .expect(400)
      .then((response) => {
        expect(response.status).toBe(400);
        expect(response.body.msg).toBe("Invalid input");
      });
  });
});
describe("GET: /api/users", () => {
  test("200: responds with an array of objects and sends back to the client", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users).toHaveLength(4);
        expect(users).toBeInstanceOf(Array);
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
  test("GET api/users should return 404 for non-existent endpoint", () => {
    return request(app)
      .get("/api/non-existent-api")
      .expect(404)
      .then((response) => {
        expect(response.status).toBe(404);
        expect(response.body.msg).toBe("Route not found");
      });
  });
});
