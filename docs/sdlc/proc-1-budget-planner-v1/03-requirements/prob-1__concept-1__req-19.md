## Requirement

If a requested statistics period contains no receipts, then the statistics service shall inform the user that no receipts were found for that period.

## Rationale

Directly answers `failure-behaviour`: an empty period must not be shown as a silent zero-filled report, which could be mistaken for zero spending. Derived from BRD E5.

## Verification

Test: request statistics for a date range with no receipts and confirm the response explicitly states none were found.

## Traces to

- [[prob-1/concept-1]] — Chosen approach

## Metadata

```json
{
  "id": "REQ-19",
  "title": "Report no-data periods explicitly",
  "pattern": "unwanted-behaviour",
  "statement": "If a requested statistics period contains no receipts, then the statistics service shall inform the user that no receipts were found for that period.",
  "rationale": "An empty period must not be shown as a silent zero-filled report, which could be mistaken for zero spending.",
  "priority": "should",
  "verification": "test",
  "traces_to": ["prob-1/concept-1"]
}
```
