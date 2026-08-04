/**
 * issueToPlan
 *
 * GH-600 3.0: an issue is the durable unit of intent in the control plane. Before
 * an autonomous agent acts, the operator wants the issue turned into a small,
 * explicit plan that can be reviewed and supervised.
 *
 * This module parses a plain-text issue body into a deterministic plan object:
 * a title and an ordered list of steps. It performs no network or API calls and
 * does not call out to a model, so the parsing is reproducible and auditable.
 */

/** A simple, reviewable plan derived from an issue. */
export interface AgentPlan {
  /** The plan title, taken from the issue title or the first heading. */
  title: string;
  /** Ordered steps the agent is expected to carry out. */
  steps: string[];
}

/**
 * Extract the title from an issue.
 *
 * Preference order:
 *   1. An explicit title argument (the GitHub issue title).
 *   2. The first Markdown heading line ("# ..." or "## ...") in the body.
 *   3. A safe fallback so the plan is never untitled.
 */
function extractTitle(body: string, explicitTitle?: string): string {
  const trimmedExplicit = explicitTitle?.trim();
  if (trimmedExplicit) {
    return trimmedExplicit;
  }

  for (const raw of body.split(/\r?\n/)) {
    const line = raw.trim();
    const heading = /^#{1,6}\s+(.*\S)\s*$/.exec(line);
    if (heading) {
      return heading[1].trim();
    }
  }

  return "Untitled agent task";
}

/**
 * Extract ordered steps from an issue body.
 *
 * A step is any line that is one of:
 *   - a Markdown task list item:   "- [ ] do the thing"
 *   - an unordered list item:      "- do the thing" or "* do the thing"
 *   - an ordered list item:        "1. do the thing"
 *
 * The leading marker is stripped so the step text is clean. Blank lines and
 * prose are ignored, which keeps the plan tight and reviewable.
 */
function extractSteps(body: string): string[] {
  const steps: string[] = [];

  for (const raw of body.split(/\r?\n/)) {
    const line = raw.trim();
    if (line === "") {
      continue;
    }

    const task = /^[-*]\s+\[[ xX]\]\s+(.*\S)\s*$/.exec(line);
    if (task) {
      steps.push(task[1].trim());
      continue;
    }

    const bullet = /^[-*]\s+(.*\S)\s*$/.exec(line);
    if (bullet) {
      steps.push(bullet[1].trim());
      continue;
    }

    const ordered = /^\d+[.)]\s+(.*\S)\s*$/.exec(line);
    if (ordered) {
      steps.push(ordered[1].trim());
      continue;
    }
  }

  return steps;
}

/**
 * Parse an issue body (and optional GitHub issue title) into a plan object.
 *
 * The result is always well-formed: a non-empty title and a (possibly empty)
 * array of steps. An empty steps array is a useful signal to an operator that the
 * issue is underspecified and should not yet dispatch an agent.
 */
export function issueToPlan(body: string, explicitTitle?: string): AgentPlan {
  const safeBody = body ?? "";
  return {
    title: extractTitle(safeBody, explicitTitle),
    steps: extractSteps(safeBody),
  };
}
