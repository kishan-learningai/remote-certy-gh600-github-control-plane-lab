/**
 * prCommenter
 *
 * GH-600 3.0: a pull request comment is how an autonomous agent reports back into
 * the control plane so a human can supervise the result. Agents should not merge
 * silently; they should summarise what they did, in a consistent, reviewable
 * format, on the PR.
 *
 * This module formats that summary comment as a deterministic Markdown string.
 * It performs no network or API calls: the caller posts the returned string via
 * the GitHub API or the `gh` CLI. Keeping formatting pure makes the comment
 * snapshot-testable and identical for the same input every time.
 */

import type { AgentRole } from "./labelRouter";

/** Everything an agent reports back about a completed unit of work. */
export interface AgentSummary {
  /** The agent role that carried out the work. */
  role: AgentRole;
  /** The issue number the work originated from, if any. */
  issueNumber?: number;
  /** A short, one-line statement of what the agent did. */
  headline: string;
  /** The discrete steps the agent completed, in order. */
  steps?: readonly string[];
  /** Whether the work still requires human approval before it can merge. */
  requiresApproval?: boolean;
  /** Optional reasons explaining the approval decision. */
  approvalReasons?: readonly string[];
}

const ROLE_LABEL: Record<AgentRole, string> = {
  triage: "Triage agent",
  review: "Review agent",
  implementation: "Implementation agent",
  documentation: "Documentation agent",
  security: "Security agent",
  unassigned: "Unassigned",
};

/**
 * Format an agent summary into a Markdown pull request comment.
 *
 * The output is stable and self-documenting: a heading that names the agent
 * role, a linked issue reference where available, the headline, an ordered list
 * of completed steps, and an explicit approval status line. The trailing
 * attribution makes it obvious to a reviewer that the comment came from the
 * agent control plane and not a human.
 */
export function formatAgentComment(summary: AgentSummary): string {
  const lines: string[] = [];
  const roleName = ROLE_LABEL[summary.role] ?? "Agent";

  lines.push(`## ${roleName} summary`);
  lines.push("");

  if (typeof summary.issueNumber === "number") {
    lines.push(`Resolves #${summary.issueNumber}.`);
    lines.push("");
  }

  lines.push(summary.headline.trim());
  lines.push("");

  const steps = summary.steps ?? [];
  if (steps.length > 0) {
    lines.push("### Steps completed");
    lines.push("");
    steps.forEach((step, index) => {
      lines.push(`${index + 1}. ${step.trim()}`);
    });
    lines.push("");
  }

  if (typeof summary.requiresApproval === "boolean") {
    const status = summary.requiresApproval
      ? "Human approval required before merge."
      : "No human approval required.";
    lines.push(`### Approval status`);
    lines.push("");
    lines.push(status);

    const reasons = summary.approvalReasons ?? [];
    if (reasons.length > 0) {
      lines.push("");
      for (const reason of reasons) {
        lines.push(`- ${reason.trim()}`);
      }
    }
    lines.push("");
  }

  lines.push("---");
  lines.push(
    "Posted by the Certy GH-600 agent control plane. Review before merging.",
  );

  return lines.join("\n");
}
