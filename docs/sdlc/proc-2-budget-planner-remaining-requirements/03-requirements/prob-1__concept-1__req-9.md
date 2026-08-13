## Requirement

If a receipt is marked requires-manual-review, then the budget calculation service shall exclude it from the monthly budget total.

## Rationale

Directly answers `failure-behaviour`: an unresolved receipt must not silently distort the user's spend total.

## Verification

Test: create a month with one flagged and one valid receipt, request the summary, and confirm the total excludes the flagged receipt.

## Traces to

- [[prob-1/concept-1]] — Chosen approach

## Metadata

```json
{
  "id": "REQ-13",
  "title": "Exclude manual-review receipts from totals",
  "pattern": "unwanted-behaviour",
  "statement": "If a receipt is marked requires-manual-review, then the budget calculation service shall exclude it from the monthly budget total.",
  "rationale": "An unresolved receipt must not silently distort the user's spend total.",
  "priority": "must",
  "verification": "test",
  "traces_to": ["prob-1/concept-1"]
}
```
