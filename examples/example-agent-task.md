# Example: an agent task issue

This is what a well-formed agent-task issue looks like once filled in from the
form. The triage agent can parse it with `issueToPlan` and route it with
`labelRouter`.

---

Title: [agent-task]: Add a deterministic retry helper

Labels: `agent:implement`

Body:

```
# Add a deterministic retry helper

We make a few flaky calls and want a small, deterministic retry helper with a
fixed backoff so behaviour is reproducible in tests.

- [ ] Write the failing test for the retry helper
- [ ] Implement the helper with a fixed backoff
- [ ] Update the documentation with a usage example

Acceptance criteria:
- Three test cases: happy path, retry-then-succeed, exhausted-retries.
- No network calls in the test.
```

---

Parsed plan (what `issueToPlan` produces):

```json
{
  "title": "Add a deterministic retry helper",
  "steps": [
    "Write the failing test for the retry helper",
    "Implement the helper with a fixed backoff",
    "Update the documentation with a usage example",
    "Three test cases: happy path, retry-then-succeed, exhausted-retries.",
    "No network calls in the test."
  ]
}
```

Routing: the `agent:implement` label resolves to the `implementation` role.
