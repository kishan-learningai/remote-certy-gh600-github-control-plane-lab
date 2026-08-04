/**
 * labelRouter
 *
 * GH-600 3.0: GitHub is the control plane. Labels on an issue are the primary
 * signal that routes a unit of work to a particular autonomous agent role.
 *
 * This module maps a label (for example "agent:triage") to the agent role that
 * should pick the work up. It is a pure, deterministic function: the same label
 * always resolves to the same role, with no network or API calls. That makes the
 * routing decision auditable and testable, which is exactly what you want when
 * you are governing autonomous agents inside a delivery workflow.
 */

/** The canonical set of agent roles an operator can route work to. */
export type AgentRole =
  | "triage"
  | "review"
  | "implementation"
  | "documentation"
  | "security"
  | "unassigned";

/**
 * The supported routing labels, mapped to the agent role that owns them.
 *
 * Keep this map small and explicit. Every entry is a governance decision: it
 * says "a label of this name is allowed to dispatch this kind of agent".
 */
const LABEL_TO_ROLE: ReadonlyMap<string, AgentRole> = new Map([
  ["agent:triage", "triage"],
  ["agent:review", "review"],
  ["agent:implement", "implementation"],
  ["agent:docs", "documentation"],
  ["agent:security", "security"],
]);

/**
 * Normalise a label so routing is case-insensitive and whitespace-tolerant.
 * GitHub label names are stored verbatim, but operators type them by hand, so we
 * defend against trivial variation without inventing new behaviour.
 */
export function normaliseLabel(label: string): string {
  return label.trim().toLowerCase();
}

/**
 * Route a single label to an agent role.
 *
 * Returns "unassigned" for any label that is not an explicit routing label.
 * An unknown label must never silently dispatch an agent: defaulting to
 * "unassigned" keeps a human in the loop.
 */
export function routeLabel(label: string): AgentRole {
  return LABEL_TO_ROLE.get(normaliseLabel(label)) ?? "unassigned";
}

/**
 * Route a set of labels (as found on an issue or pull request) to the first
 * matching agent role. Labels are evaluated in the order they appear so an
 * operator keeps deterministic control over precedence by ordering the labels.
 *
 * Returns "unassigned" when no label maps to a role.
 */
export function routeLabels(labels: readonly string[]): AgentRole {
  for (const label of labels) {
    const role = routeLabel(label);
    if (role !== "unassigned") {
      return role;
    }
  }
  return "unassigned";
}

/** List the routing labels that are recognised by the control plane. */
export function knownRoutingLabels(): string[] {
  return [...LABEL_TO_ROLE.keys()];
}
