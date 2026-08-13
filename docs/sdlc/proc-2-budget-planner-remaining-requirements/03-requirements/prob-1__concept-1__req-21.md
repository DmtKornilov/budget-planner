## Requirement

If a receipt is marked requires-manual-review, then the budget calculation service shall indicate the count of excluded receipts in the monthly budget summary.

## Rationale

Split from the exclusion requirement (REQ-13) to keep each requirement to a single capability. Without this, a user cannot tell their total is incomplete due to pending review.

## Verification

Test: create a month with one flagged and one valid receipt, request the summary, and confirm it states one receipt was excluded.

## Traces to

- [[prob-1/concept-1]] — Chosen approach

## Metadata

```json
{
  "id": "REQ-25",
  "title": "Report excluded-receipt count in monthly summary",
  "pattern": "unwanted-behaviour",
  "statement": "If a receipt is marked requires-manual-review, then the budget calculation service shall indicate the count of excluded receipts in the monthly budget summary.",
  "rationale": "Without this, a user cannot tell their total is incomplete due to pending review.",
  "priority": "must",
  "verification": "test",
  "traces_to": ["prob-1/concept-1"]
}
```
