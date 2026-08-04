# Label taxonomy

Labels are the routing and governance signals of the control plane. Keep the set
small and explicit: every label is a permission to do something, so an
unrecognised label must never silently dispatch an agent.

## Routing labels

These map a task to an agent role. They are defined in `src/automation/labelRouter.ts`.

| Label             | Agent role       | Meaning                                  |
| ----------------- | ---------------- | ---------------------------------------- |
| `agent:triage`    | triage           | Read the issue, build a plan, route it.  |
| `agent:implement` | implementation   | Make the code change on a branch and PR. |
| `agent:review`    | review           | Inspect a PR and post a summary.         |
| `agent:docs`      | documentation    | Update or write documentation.           |
| `agent:security`  | security         | Perform a security-focused review.       |

Anything else routes to `unassigned`.

## Governance labels

These influence the approval decision in `src/automation/approvalCheck.ts`.

| Label              | Effect                                                       |
| ------------------ | ----------------------------------------------------------- |
| `risky`            | Forces human approval.                                       |
| `agent:risky`      | Forces human approval.                                       |
| `needs-human`      | Forces human approval.                                       |
| `security`         | Forces human approval.                                       |
| `agent:auto`       | Skips approval, but only when no protected path is touched.  |
| `low-risk`         | Marks a task as low risk; never overrides a protected path.  |

## Rules

- A protected path beats any auto-approve label: governance over convenience.
- Routing precedence follows label order, so an operator keeps deterministic
  control by ordering labels deliberately.
- Add new labels sparingly, and update the two source modules and these tables
  together so the taxonomy and the code never drift apart.
