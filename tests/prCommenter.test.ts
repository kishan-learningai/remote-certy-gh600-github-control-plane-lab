import { test } from "node:test";
import assert from "node:assert/strict";
import { formatAgentComment } from "../src/automation/prCommenter";

test("formats a heading naming the agent role", () => {
  const comment = formatAgentComment({
    role: "triage",
    headline: "Triaged the issue and added labels.",
  });
  assert.match(comment, /## Triage agent summary/);
  assert.match(comment, /Triaged the issue and added labels\./);
});

test("includes a resolves reference when an issue number is given", () => {
  const comment = formatAgentComment({
    role: "implementation",
    issueNumber: 42,
    headline: "Implemented the retry helper.",
  });
  assert.match(comment, /Resolves #42\./);
});

test("renders completed steps as an ordered list", () => {
  const comment = formatAgentComment({
    role: "implementation",
    headline: "Done.",
    steps: ["Wrote the test", "Implemented", "Updated docs"],
  });
  assert.match(comment, /1\. Wrote the test/);
  assert.match(comment, /3\. Updated docs/);
});

test("states approval status with reasons", () => {
  const comment = formatAgentComment({
    role: "security",
    headline: "Reviewed.",
    requiresApproval: true,
    approvalReasons: ["Protected path changed: .github/workflows/ci.yml"],
  });
  assert.match(comment, /Human approval required before merge\./);
  assert.match(comment, /Protected path changed/);
});

test("always ends with the control-plane attribution", () => {
  const comment = formatAgentComment({
    role: "review",
    headline: "Looks good.",
  });
  assert.match(comment, /Certy GH-600 agent control plane/);
});

test("is deterministic for the same input", () => {
  const input = {
    role: "documentation" as const,
    headline: "Docs updated.",
    steps: ["Edit README"],
  };
  assert.equal(formatAgentComment(input), formatAgentComment(input));
});
