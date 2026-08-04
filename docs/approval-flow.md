# Approval flow

Governing autonomous agents means deciding, deterministically, when a human must
approve before work proceeds or merges. The control plane makes that decision
from two signals only: labels and changed paths. The logic lives in
`src/automation/approvalCheck.ts` and is a pure function, so the same inputs
always produce the same decision and the gate is auditable.

## Decision order

The check evaluates rules in strict precedence:

1. Protected path changed. If any changed path is protected
   (`.github/`, `.github/workflows/`, `infra/`, `deploy/`, `secrets/`, `.env`,
   dependency manifests, CODEOWNERS), approval is required. This cannot be
   overridden by an auto-approve label.
2. Risky label present. A `risky`, `agent:risky`, `needs-human`, `security`, or
   `agent:security` label forces approval.
3. Auto-approve label present. With no protected path and no risky label, an
   `agent:auto` or `low-risk` label skips approval.
4. Default. Otherwise no approval is required (a low-risk change to ordinary
   files).

## How it is enforced in GitHub

The pure decision is advisory until GitHub enforces it:

- The example `human-approval.yml` workflow runs as a required status check. When
  approval is required and no human has approved, the check fails.
- A branch protection rule requires that check plus a CODEOWNERS review on
  protected paths.
- Workflow tokens use least privilege: the review agent can comment but cannot
  merge, so it is impossible for an agent to self-merge a change that needed a
  human.

## Audit trail

`approvalCheck` returns `reasons` alongside the decision. Surfacing those reasons
in the PR comment (via `prCommenter`) gives an operator a clear, permanent record
of why a task did or did not require human approval.
