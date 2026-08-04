# Certy GH-600: GitHub control plane lab

A public, fully runnable and tested TypeScript training repository for the Certy
GH-600 GitHub Agentic AI Developer course. It teaches GitHub as the control plane
for operating, supervising, and governing autonomous agents within a
GitHub-driven delivery workflow.

- Course site: https://certy.pro
- Course content: https://github.com/CertyPro/certy-gh600-course-content
- Organisation: https://github.com/CertyPro

## What this lab teaches

GH-600 3.0 is about running agents through the primitives you already use to ship
software. GitHub coordinates agents through:

- Issues - the durable unit of intent, parsed into a plan before any action.
- Labels - the routing signal that maps a task to an agent role.
- Pull requests - the unit of change an agent produces and where it reports back.
- Actions - the execution trigger and runtime for agent steps.
- Checks - the execution gate; a change cannot merge until checks pass.
- Reviews and CODEOWNERS - the human governance gate over sensitive files.

The through-line is governance: nothing merges silently, risky or protected work
always needs a human, and every decision is deterministic and auditable.

## Layout

```
src/automation/        Pure, deterministic control-plane functions
  labelRouter.ts         Map a label to an agent role
  issueToPlan.ts         Parse an issue body into a plan object
  approvalCheck.ts       Decide if a task needs human approval
  prCommenter.ts         Format an agent summary PR comment
tests/                 node:test suites for each module
docs/                  The operating model, lifecycle, taxonomy, approval flow
examples/              A worked agent task and the resulting PR comment
labs/                  Eight hands-on labs from the GH-600 brief
.github/               The control plane itself
  workflows/ci.yml         Real CI: install, test, typecheck
  workflows/agent-*.yml    Teaching examples, gated to workflow_dispatch
  ISSUE_TEMPLATE/          Agent task and bug report forms
  pull_request_template.md
  CODEOWNERS               Example governance map
  dependabot.yml
```

## Run it

Requires Node 22 or newer.

```bash
npm install --no-fund --no-audit
npm test
npm run typecheck
```

The code is pure TypeScript with no runtime dependencies, no network, and no API
calls, so every result is deterministic and reproducible.

## The workflows

`ci.yml` is the real continuous-integration workflow and runs on every push and
pull request. The `agent-triage.yml`, `agent-review.yml`, and `human-approval.yml`
workflows are teaching examples: they are valid YAML but gated to
`on: workflow_dispatch` so they never run automatically and never error on push.
Each one explains, in comments, how a live trigger (an issue event, a PR event, a
review event) would dispatch agent work under least-privilege permissions.

## Licence

MIT. See `LICENSE`. Author: Certy (Coded Vision Design).
