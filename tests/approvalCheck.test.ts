import { test } from "node:test";
import assert from "node:assert/strict";
import { approvalCheck, isProtectedPath } from "../src/automation/approvalCheck";

test("a 'risky' label requires human approval", () => {
  const decision = approvalCheck({ labels: ["risky"] });
  assert.equal(decision.requiresApproval, true);
  assert.ok(decision.reasons.some((r) => r.includes("Risky label")));
});

test("a protected path requires approval regardless of labels", () => {
  const decision = approvalCheck({
    labels: ["agent:auto"],
    changedPaths: [".github/workflows/ci.yml"],
  });
  assert.equal(decision.requiresApproval, true);
  assert.ok(decision.reasons.some((r) => r.includes("Protected path")));
});

test("auto-approve cannot override a protected path", () => {
  const decision = approvalCheck({
    labels: ["low-risk", "agent:auto"],
    changedPaths: ["src/app.ts", "package.json"],
  });
  assert.equal(decision.requiresApproval, true);
});

test("an auto-approve label on a safe change skips approval", () => {
  const decision = approvalCheck({
    labels: ["agent:auto"],
    changedPaths: ["src/feature.ts", "tests/feature.test.ts"],
  });
  assert.equal(decision.requiresApproval, false);
});

test("a plain low-risk task with no sensitive paths does not need approval", () => {
  const decision = approvalCheck({
    labels: ["bug"],
    changedPaths: ["src/util.ts"],
  });
  assert.equal(decision.requiresApproval, false);
});

test("empty input defaults to no approval required", () => {
  const decision = approvalCheck({});
  assert.equal(decision.requiresApproval, false);
});

test("isProtectedPath recognises sensitive files and tolerates separators", () => {
  assert.equal(isProtectedPath(".github/workflows/deploy.yml"), true);
  assert.equal(isProtectedPath(".\\.github\\dependabot.yml"), true);
  assert.equal(isProtectedPath("infra/main.tf"), true);
  assert.equal(isProtectedPath(".env"), true);
  assert.equal(isProtectedPath("src/index.ts"), false);
  assert.equal(isProtectedPath(""), false);
});
