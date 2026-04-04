import test from "node:test";
import assert from "node:assert/strict";
import { getExperiment } from "../../src/controllers/experiment.controller.js";

test("GET /experiment returns a stable assignment payload", async (t) => {
  const createMocks = () => {
    const response = {
      statusCode: 200,
      body: null,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(payload) {
        this.body = payload;
        return this;
      }
    };

    const nextCalls = [];

    return {
      req: {
        query: {
          user_id: "42"
        }
      },
      res: response,
      next: (error) => nextCalls.push(error),
      nextCalls
    };
  };

  const first = createMocks();
  const second = createMocks();

  await getExperiment(first.req, first.res, first.next);
  await getExperiment(second.req, second.res, second.next);

  assert.equal(first.res.statusCode, 200);
  assert.equal(second.res.statusCode, 200);
  assert.equal(first.nextCalls.length, 0);
  assert.equal(second.nextCalls.length, 0);

  assert.equal(
    first.res.body.data.assignment.variant,
    second.res.body.data.assignment.variant
  );
  assert.equal(
    first.res.body.data.assignment.bucket,
    second.res.body.data.assignment.bucket
  );
  assert.equal(first.res.body.data.user.id, "42");
});

test("GET /experiment rejects a missing user_id", async () => {
  const req = {
    query: {}
  };

  const res = {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    }
  };

  let nextError = null;

  await getExperiment(req, res, (error) => {
    nextError = error;
  });

  assert.ok(nextError);
  assert.equal(nextError.statusCode, 400);
  assert.equal(nextError.message, "Query parameter 'user_id' is required.");
});
