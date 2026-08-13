## Requirement

While the current date is within an in-progress calendar month, the budget calculation service shall present the budget total as a month-to-date figure labeled as incomplete.

## Rationale

Prevents a user from mistaking a partial-month total for a final one.

## Verification

Test: request the budget summary for the current, not-yet-complete month and confirm the response is labeled as month-to-date/incomplete.

## Traces to

- [[prob-1/concept-1]] — Chosen approach

## Metadata

```json
{
  "id": "REQ-14",
  "title": "Label in-progress month totals as incomplete",
  "pattern": "state-driven",
  "statement": "While the current date is within an in-progress calendar month, the budget calculation service shall present the budget total as a month-to-date figure labeled as incomplete.",
  "rationale": "Prevents a user from mistaking a partial-month total for a final one.",
  "priority": "must",
  "verification": "test",
  "traces_to": ["prob-1/concept-1"]
}
```
