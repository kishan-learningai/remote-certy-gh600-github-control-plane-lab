/**
 * approvalCheck
 *
 * GH-600 3.0: governing autonomous agents means deciding, deterministically,
 * when a human must approve before the agent's work can proceed or merge.
 *
 * This module decides whether a task needs human approval based on two signals
 * that live entirely inside the control plane:
 *   1. Labels   - an explicit "risky" marker, or a low-risk "auto" override.
 *   2. Paths    - whether the change touches protected, sensitive files.
 *
 * It is a pure function with no network or API calls, so the approval gate is
 * reproducible and easy to reason about during an audit.
 */

/** The decision returned by the approval check, with the reasons behind it. */
export interface ApprovalDecision {
  /** True when a human must approve before the agent task proceeds. */
  requiresApproval: boolean;
  /** Human-readable reasons, useful for an audit trail or a PR comment. */
  reasons: string[];
}

/** Inputs to the approval decision, drawn from the issue or pull request. */
export interface ApprovalInput {
  /** Labels currently applied to the issue or pull request. */
  labels?: readonly string[];
  /** Repository-relative paths the task intends to change. */
  changedPaths?: readonly string[];
}

/** Labels that always force human approval. */
const RISKY_LABELS: ReadonlySet<string> = new Set([
  "risky",
  "agent:risky",
  "needs-human",
  "security",
  "agent:security",
]);

/**
 * Labels that explicitly opt a task out of approval. These are deliberately
 * narrow: only an operator should add them, and they never override a protected
 * path match (see below).
 */
const AUTO_APPROVE_LABELS: ReadonlySet<string> = new Set([
  "agent:auto",
  "low-risk",
]);

/**
 * Glob-free protected path prefixes and suffixes. A change touching any of
 * these always requires approval, regardless of labels. This is the
 * CODEOWNERS-style governance line drawn around sensitive files.
 */
const PROTECTED_PREFIXES: readonly string[] = [
  ".github/workflows/",
  ".github/",
  "infra/",
  "deploy/",
  "secrets/",
];

const PROTECTED_SUFFIXES: readonly string[] = [
  ".env",
  "dependabot.yml",
  "codeowners",
];

const PROTECTED_FILENAMES: readonly string[] = [
  "package.json",
  "package-lock.json",
];

function normalisePath(path: string): string {
  return path.trim().replace(/\\/g, "/").replace(/^\.\//, "").toLowerCase();
}

/** True when a single path is considered protected. */
export function isProtectedPath(path: string): boolean {
  const p = normalisePath(path);
  if (p === "") {
    return false;
  }
  if (PROTECTED_PREFIXES.some((prefix) => p.startsWith(prefix))) {
    return true;
  }
  if (PROTECTED_SUFFIXES.some((suffix) => p.endsWith(suffix))) {
    return true;
  }
  const filename = p.split("/").pop() ?? p;
  return PROTECTED_FILENAMES.includes(filename);
}

/**
 * Decide whether an agent task needs human approval.
 *
 * Rules, in order of precedence:
 *   1. Any protected path  -> approval required (cannot be auto-approved away).
 *   2. Any risky label     -> approval required.
 *   3. An auto-approve label with no protected path and no risky label
 *                          -> approval not required.
 *   4. Otherwise           -> approval not required (the safe default for a
 *      low-risk task that touches no sensitive files).
 */
export function approvalCheck(input: ApprovalInput): ApprovalDecision {
  const labels = (input.labels ?? []).map((l) => l.trim().toLowerCase());
  const changedPaths = input.changedPaths ?? [];
  const reasons: string[] = [];

  const protectedPaths = changedPaths.filter(isProtectedPath);
  if (protectedPaths.length > 0) {
    for (const p of protectedPaths) {
      reasons.push(`Protected path changed: ${p.trim()}`);
    }
    return { requiresApproval: true, reasons };
  }

  const riskyHits = labels.filter((l) => RISKY_LABELS.has(l));
  if (riskyHits.length > 0) {
    for (const l of riskyHits) {
      reasons.push(`Risky label present: ${l}`);
    }
    return { requiresApproval: true, reasons };
  }

  const autoHits = labels.filter((l) => AUTO_APPROVE_LABELS.has(l));
  if (autoHits.length > 0) {
    reasons.push(`Auto-approve label present: ${autoHits[0]}`);
    return { requiresApproval: false, reasons };
  }

  reasons.push("No risky label or protected path detected");
  return { requiresApproval: false, reasons };
}
