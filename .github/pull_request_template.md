<!--
GH-600 control plane: this template is filled by whoever (human or agent) opens
the PR. An agent fills it from the issue plan; a human fills it by hand. The
review agent and the human approval gate both read these sections.
-->

## Summary

<!-- One line: what this change does and why. -->

Resolves #

## What changed

<!-- Bullet the discrete changes. An implementation agent lists the steps it
completed here, mirroring the plan from the issue. -->

-

## Agent provenance

- Opened by: <!-- human | implementation agent | docs agent -->
- Originating issue plan followed: <!-- yes/no, link the issue -->

## Approval

<!-- The review agent computes this with src/automation/approvalCheck.ts.
A human must confirm it. -->

- [ ] This change touches protected paths (`.github/`, `infra/`, secrets, deps).
- [ ] This change carries a risky label.
- [ ] Human approval is required before merge.

## Checks

- [ ] `npm test` passes.
- [ ] `npm run typecheck` passes.
- [ ] No secrets, credentials, or PII are included.
- [ ] British English used throughout.
