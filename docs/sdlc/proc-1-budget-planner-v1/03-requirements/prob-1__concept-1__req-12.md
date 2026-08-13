## Requirement

When the user requests a monthly budget summary, the budget calculation service shall aggregate the total amount of all categorized, non-flagged receipts within the selected calendar month using each receipt's transaction date.

## Rationale

This is the primary success signal confirmed for this build (adoption + engagement depends on users actually seeing a useful monthly total). Derived from BRD D1/D2.

## Verification

Test: create receipts across two different months and confirm the requested month's summary sums only that month's transaction-dated receipts.

## Traces to

- [[prob-1/concept-1]] — Chosen approach
- [[prob-1]] — Success metrics

## Metadata

```json
{
  "id": "REQ-12",
  "title": "Aggregate monthly spend from valid receipts",
  "pattern": "event-driven",
  "statement": "When the user requests a monthly budget summary, the budget calculation service shall aggregate the total amount of all categorized, non-flagged receipts within the selected calendar month using each receipt's transaction date.",
  "rationale": "This is the primary success signal confirmed for this build.",
  "priority": "must",
  "verification": "test",
  "traces_to": ["prob-1/concept-1", "prob-1"]
}
```
