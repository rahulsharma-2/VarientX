import test from "node:test";
import assert from "node:assert/strict";
import { assignVariant } from "../../src/services/assignment.service.js";

test("assignVariant returns the same variant for the same input", () => {
  const input = {
    experimentKey: "homepage-hero-cta",
    userId: "42",
    salt: "devbytes-assignment-v1",
    variants: [
      { key: "A", weight: 50, config: {} },
      { key: "B", weight: 50, config: {} }
    ]
  };

  const first = assignVariant(input);
  const second = assignVariant(input);

  assert.equal(first.variant.key, second.variant.key);
  assert.equal(first.bucket, second.bucket);
});

test("assignVariant always chooses one of the configured variants", () => {
  const result = assignVariant({
    experimentKey: "homepage-hero-cta",
    userId: "alpha-user",
    salt: "devbytes-assignment-v1",
    variants: [
      { key: "A", weight: 10, config: {} },
      { key: "B", weight: 20, config: {} },
      { key: "C", weight: 70, config: {} }
    ]
  });

  assert.ok(["A", "B", "C"].includes(result.variant.key));
  assert.ok(result.bucket >= 0);
  assert.ok(result.bucket <= 100);
});
