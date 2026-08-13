## Requirement

If the user has fewer than the configured minimum number of receipts on record, then the goal-advice service shall inform the user that more historical data is needed.

## Rationale

Directly answers `failure-behaviour` for the advice path: generating a confident-sounding recommendation from too little data would produce misleading advice.

## Verification

Test: request advice for a new account with only one or two receipts and confirm the response states more data is needed.

## Traces to

- [[prob-1/concept-1]] — Chosen approach

## Metadata

```json
{
  "id": "REQ-21",
  "title": "Inform the user when historical data is insufficient",
  "pattern": "unwanted-behaviour",
  "statement": "If the user has fewer than the configured minimum number of receipts on record, then the goal-advice service shall inform the user that more historical data is needed.",
  "rationale": "Generating a confident-sounding recommendation from too little data would produce misleading advice.",
  "priority": "could",
  "verification": "test",
  "traces_to": ["prob-1/concept-1"]
}
```
