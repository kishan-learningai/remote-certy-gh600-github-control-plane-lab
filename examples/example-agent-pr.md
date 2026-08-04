# Example: an agent pull request summary comment

When the implementation agent finishes the task from
`example-agent-task.md`, it opens a pull request and posts a summary comment.
The comment below is the exact output of `formatAgentComment` from
`src/automation/prCommenter.ts` for this input:

```ts
formatAgentComment({
  role: "implementation",
  issueNumber: 12,
  headline: "Added a deterministic retry helper with a fixed backoff.",
  steps: [
    "Wrote the failing test for the retry helper",
    "Implemented the helper with a fixed backoff",
    "Updated the documentation with a usage example",
  ],
  requiresApproval: false,
  approvalReasons: ["No risky label or protected path detected"],
});
```

Rendered comment:

```markdown
## Implementation agent summary

Resolves #12.

Added a deterministic retry helper with a fixed backoff.

### Steps completed

1. Wrote the failing test for the retry helper
2. Implemented the helper with a fixed backoff
3. Updated the documentation with a usage example

### Approval status

No human approval required.

- No risky label or protected path detected

---
Posted by the Certy GH-600 agent control plane. Review before merging.
```

If the same change had touched `.github/workflows/ci.yml`, `approvalCheck` would
have returned `requiresApproval: true` with a protected-path reason, the comment
would read "Human approval required before merge.", and the human approval gate
would block the merge until a code owner approved.
