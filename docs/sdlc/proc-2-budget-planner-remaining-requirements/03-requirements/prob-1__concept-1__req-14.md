## Requirement

When the user requests category statistics for a date range, the statistics service shall calculate the total spend, percentage of overall spend, and transaction count for each category, ranked from highest to lowest spend.

## Rationale

Directly serves [[prob-1]]'s Problem (understanding where money goes by category). Priority is should per the confirmed `must-have` answer.

## Verification

Test: request statistics for a date range with receipts in multiple categories and confirm the response includes total, percentage, and count per category, ranked descending.

## Traces to

- [[prob-1/concept-1]] — Chosen approach
- [[prob-1]] — Problem

## Metadata

```json
{
  "id": "REQ-18",
  "title": "Provide ranked category statistics for a date range",
  "pattern": "event-driven",
  "statement": "When the user requests category statistics for a date range, the statistics service shall calculate the total spend, percentage of overall spend, and transaction count for each category, ranked from highest to lowest spend.",
  "rationale": "Directly serves the stated problem: understanding where money goes by category.",
  "priority": "should",
  "verification": "test",
  "traces_to": ["prob-1/concept-1", "prob-1"]
}
```
