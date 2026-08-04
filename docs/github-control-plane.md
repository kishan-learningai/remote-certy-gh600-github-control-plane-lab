# GitHub as the control plane

GH-600 3.0 treats GitHub itself as the control plane for autonomous agents. Every
signal an agent needs to start, every gate that supervises it, and every record
of what it did lives in primitives you already use to ship software.

## Why GitHub is a good control plane

- It is durable and auditable. Issues, labels, pull requests, reviews, checks,
  and the audit log are all first-class, queryable records.
- It already has a permission model. Branch protection, required reviews,
  CODEOWNERS, and least-privilege workflow tokens govern who and what may act.
- It is event-driven. Opening an issue, applying a label, or pushing a commit are
  events that can dispatch work, so agents are triggered by the same actions
  humans take.

## The primitives and what they do

| Primitive            | Role in the control plane                                        |
| -------------------- | ---------------------------------------------------------------- |
| Issue                | The durable unit of intent. Parsed into a plan before any action. |
| Label                | The routing signal. Maps a task to an agent role.                |
| Pull request         | The unit of change an agent produces, and where it reports back. |
| PR comment           | How an agent summarises its work for human supervision.          |
| Actions workflow     | The execution trigger and runtime for agent steps.               |
| Status check         | The execution gate. A change cannot merge until checks pass.     |
| Review and CODEOWNERS| The human governance gate over sensitive files.                  |
| Audit log            | The record an operator uses to supervise and review behaviour.   |

## Operate, supervise, govern

GH-600 is about operating, supervising, and governing autonomous agents inside
GitHub-driven delivery.

- Operate: issues and labels dispatch agents; Actions run them.
- Supervise: agents report via PR comments and checks; nothing merges silently.
- Govern: CODEOWNERS, required reviews, the approval gate, and least-privilege
  tokens keep a human in the loop on anything risky or sensitive.

The pure functions in `src/automation/` implement the deterministic decisions
behind these gates: `labelRouter` routes, `issueToPlan` plans, `approvalCheck`
governs, and `prCommenter` reports.
