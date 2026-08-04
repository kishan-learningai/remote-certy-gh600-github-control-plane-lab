import { test } from "node:test";
import assert from "node:assert/strict";
import { issueToPlan } from "../src/automation/issueToPlan";

const SAMPLE_BODY = `# Add a retry helper

We need a small retry helper for flaky calls.

- [ ] Write the failing test
- [ ] Implement the helper
- [ ] Update the docs
`;

test("extracts the title from the first heading when no explicit title", () => {
  const plan = issueToPlan(SAMPLE_BODY);
  assert.equal(plan.title, "Add a retry helper");
});

test("prefers an explicit GitHub issue title over the heading", () => {
  const plan = issueToPlan(SAMPLE_BODY, "Explicit title");
  assert.equal(plan.title, "Explicit title");
});

test("extracts ordered steps from task list items", () => {
  const plan = issueToPlan(SAMPLE_BODY);
  assert.deepEqual(plan.steps, [
    "Write the failing test",
    "Implement the helper",
    "Update the docs",
  ]);
});

test("supports unordered and ordered list markers", () => {
  const body = `## Plan
* first thing
- second thing
1. third thing
2) fourth thing
`;
  const plan = issueToPlan(body);
  assert.equal(plan.title, "Plan");
  assert.deepEqual(plan.steps, [
    "first thing",
    "second thing",
    "third thing",
    "fourth thing",
  ]);
});

test("ignores prose and blank lines, leaving steps empty when underspecified", () => {
  const body = "Just a vague request with no steps at all.";
  const plan = issueToPlan(body);
  assert.equal(plan.title, "Untitled agent task");
  assert.deepEqual(plan.steps, []);
});

test("handles an empty body safely", () => {
  const plan = issueToPlan("");
  assert.equal(plan.title, "Untitled agent task");
  assert.deepEqual(plan.steps, []);
});
