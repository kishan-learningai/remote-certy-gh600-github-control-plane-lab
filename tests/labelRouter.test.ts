import { test } from "node:test";
import assert from "node:assert/strict";
import {
  routeLabel,
  routeLabels,
  normaliseLabel,
  knownRoutingLabels,
} from "../src/automation/labelRouter";

test("routes 'agent:triage' to the triage role", () => {
  assert.equal(routeLabel("agent:triage"), "triage");
});

test("routes each known label to its agent role", () => {
  assert.equal(routeLabel("agent:review"), "review");
  assert.equal(routeLabel("agent:implement"), "implementation");
  assert.equal(routeLabel("agent:docs"), "documentation");
  assert.equal(routeLabel("agent:security"), "security");
});

test("routing is case- and whitespace-insensitive", () => {
  assert.equal(routeLabel("  AGENT:Triage  "), "triage");
  assert.equal(normaliseLabel("  Agent:Review "), "agent:review");
});

test("unknown labels route to 'unassigned' (human stays in the loop)", () => {
  assert.equal(routeLabel("bug"), "unassigned");
  assert.equal(routeLabel(""), "unassigned");
});

test("routeLabels returns the first matching role by order", () => {
  assert.equal(routeLabels(["bug", "agent:review", "agent:triage"]), "review");
});

test("routeLabels returns 'unassigned' when nothing matches", () => {
  assert.equal(routeLabels(["bug", "question"]), "unassigned");
  assert.equal(routeLabels([]), "unassigned");
});

test("knownRoutingLabels lists the recognised routing labels", () => {
  const labels = knownRoutingLabels();
  assert.ok(labels.includes("agent:triage"));
  assert.equal(labels.length, 5);
});
