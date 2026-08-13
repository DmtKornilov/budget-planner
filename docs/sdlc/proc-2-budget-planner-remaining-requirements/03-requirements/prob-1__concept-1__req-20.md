## Requirement

When a user deletes a receipt, the system shall remove it from all budget and statistics calculations within the same session.

## Rationale

Prevents a deleted receipt from continuing to distort totals the user is actively viewing.

## Verification

Test: delete a receipt and, without reloading, confirm the visible budget total and statistics update to exclude it.

## Traces to

- [[prob-1/concept-1]] — Chosen approach

## Metadata

```json
{
  "id": "REQ-24",
  "title": "Remove deleted receipts from calculations immediately",
  "pattern": "event-driven",
  "statement": "When a user deletes a receipt, the system shall remove it from all budget and statistics calculations within the same session.",
  "rationale": "Prevents a deleted receipt from continuing to distort totals the user is actively viewing.",
  "priority": "must",
  "verification": "test",
  "traces_to": ["prob-1/concept-1"]
}
```
