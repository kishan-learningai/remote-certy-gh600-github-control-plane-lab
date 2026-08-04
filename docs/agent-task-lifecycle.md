# Agent task lifecycle

A unit of agent work moves through a fixed lifecycle in the control plane. Each
stage maps to a GitHub primitive and to one of the pure functions in this lab.

## Stages

1. Intake. A human opens an issue with the agent-task form
   (`.github/ISSUE_TEMPLATE/agent-task.yml`). The issue carries the intent.

2. Plan. The triage agent turns the issue body into a plan with `issueToPlan`.
   An empty step list means the issue is underspecified and should be sent back
   for clarification, not dispatched.

3. Route. Labels decide ownership. `labelRouter` maps a label such as
   `agent:implement` to the implementation role. Unknown labels resolve to
   `unassigned` so a human stays in the loop.

4. Execute. An Actions workflow (see the example `agent-*` workflows) dispatches
   the agent. The agent works on a branch and opens a pull request.

5. Govern. `approvalCheck` decides whether the change needs human approval based
   on labels and changed paths. Protected paths always require approval and can
   never be auto-approved away.

6. Report. The agent posts a structured summary with `prCommenter` so a reviewer
   can see exactly what was done and the approval status.

7. Gate. Required status checks (the real `ci.yml`) and the human approval gate
   must pass. CODEOWNERS forces a named human team to review sensitive files.

8. Merge and record. Only after the gates pass does the change merge. The issue,
   PR, comments, reviews, and audit log form the permanent record an operator
   uses to supervise behaviour over time.

## Where a human stays in the loop

- Underspecified plans (no steps) are bounced back at stage 2.
- Unknown labels are not routed at stage 3.
- Risky labels and protected paths force approval at stage 5.
- Required checks and CODEOWNERS block the merge at stage 7.
