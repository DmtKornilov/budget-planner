## Requirement

If the receipt digitization service cannot extract a total amount or a transaction date, then the receipt digitization service shall mark the receipt as requires-manual-review and exclude it from automated budget calculations.

## Rationale

Directly answers the `failure-behaviour` question: unparseable receipts must not silently corrupt totals.

## Verification

Test: submit a receipt photo with the total amount obscured and confirm it is marked requires-manual-review and excluded from budget totals.

## Traces to

- [[prob-1/concept-1]] — Chosen approach

## Metadata

```json
{
  "id": "REQ-5",
  "title": "Route unparseable receipts to manual review",
  "pattern": "unwanted-behaviour",
  "statement": "If the receipt digitization service cannot extract a total amount or a transaction date, then the receipt digitization service shall mark the receipt as requires-manual-review and exclude it from automated budget calculations.",
  "rationale": "Confirmed via the failure-behaviour answer: unparseable receipts must not silently corrupt totals.",
  "priority": "must",
  "verification": "test",
  "traces_to": ["prob-1/concept-1"]
}
```
