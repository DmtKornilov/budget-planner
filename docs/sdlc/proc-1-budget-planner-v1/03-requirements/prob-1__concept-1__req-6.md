## Requirement

When parsing succeeds, the receipt digitization service shall persist the extracted receipt, including header, line items, and a reference to the original image, to the database with a unique receipt identifier.

## Rationale

Without persistence there is no budget to calculate later. Derived from BRD A12/A13, and ties to [[prob-1/concept-1]]'s chosen data layer (Postgres, cheap hosted tier).

## Verification

Test: submit a valid receipt and confirm a corresponding record exists in the database with all fields and a unique id.

## Traces to

- [[prob-1/concept-1]] — Chosen approach, data model on Postgres

## Metadata

```json
{
  "id": "REQ-6",
  "title": "Persist parsed receipts",
  "pattern": "event-driven",
  "statement": "When parsing succeeds, the receipt digitization service shall persist the extracted receipt, including header, line items, and a reference to the original image, to the database with a unique receipt identifier.",
  "rationale": "Without persistence there is no budget to calculate later.",
  "priority": "must",
  "verification": "test",
  "traces_to": ["prob-1/concept-1"]
}
```
