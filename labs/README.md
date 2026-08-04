# GH-600 labs: GitHub as the control plane

Eight hands-on labs from the GH-600 brief. They build, in order, a control plane
that operates, supervises, and governs autonomous agents inside a GitHub-driven
delivery workflow. Each lab points at the files in this repository you will read,
run, or extend.

Run the test suite at any time to check your work:

```bash
npm install --no-fund --no-audit
npm test
npm run typecheck
```

## Lab 1 - Author an agent task issue template

Goal: make it easy and consistent to hand work to an agent.

- Read `.github/ISSUE_TEMPLATE/agent-task.yml` and `bug-report.yml`.
- Open a new issue in your fork using the form and confirm it lands with the
  `agent:triage` label applied automatically.

## Lab 2 - Use labels to route work to an agent role

Goal: turn a label into a routing decision.

- Read `src/automation/labelRouter.ts` and `tests/labelRouter.test.ts`.
- Add a new role and label (for example `agent:test` to a `testing` role), then
  add a test that asserts it routes correctly. Keep unknown labels mapping to
  `unassigned`.

## Lab 3 - Trigger a workflow from an issue

Goal: connect an event to execution.

- Read `.github/workflows/agent-triage.yml`.
- Note the commented `on: issues: [opened, labeled]` trigger and how it would
  dispatch the triage agent. Run the workflow manually via `workflow_dispatch`
  with an issue number to see the illustrative steps.

## Lab 4 - Add a human approval label

Goal: keep a human in the loop on risky work.

- Read `src/automation/approvalCheck.ts` and `tests/approvalCheck.test.ts`.
- Confirm that a `risky` label forces approval and that an `agent:auto` label
  cannot override a protected path. Add a governance label of your own and test it.

## Lab 5 - CODEOWNER review for sensitive files

Goal: govern who must review protected paths.

- Read `.github/CODEOWNERS`.
- Map `/.github/workflows/` and `/src/automation/` to a team. Pair it with a
  branch protection rule that requires code-owner review so an agent cannot merge
  control-plane changes alone.

## Lab 6 - PR comments for agent summaries

Goal: make agents report back for supervision.

- Read `src/automation/prCommenter.ts` and `tests/prCommenter.test.ts`.
- Produce a summary comment for a task and verify the rendered Markdown matches
  `examples/example-agent-pr.md`.

## Lab 7 - Actions as the execution trigger

Goal: understand the execution gate.

- Read the real `.github/workflows/ci.yml` and the example `agent-review.yml`
  and `human-approval.yml`.
- Explain why the review agent's token has `pull-requests: write` but no merge
  permission, and how a required check blocks an unapproved merge.

## Lab 8 - Document the lifecycle

Goal: write the operating model down.

- Read `docs/agent-task-lifecycle.md`, `docs/approval-flow.md`,
  `docs/label-taxonomy.md`, and `docs/github-control-plane.md`.
- Extend the lifecycle doc with a stage of your own (for example a rollback
  stage) and describe which primitive and which pure function would back it.
