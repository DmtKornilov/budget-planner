## Requirement

When a valid check photo is received, the receipt digitization service shall extract the merchant name, transaction date, transaction time, line items, and total amount.

## Rationale

This is the core value proposition stated in [[prob-1]]'s Problem section: turning a receipt photo into structured, item-level data. Derived from BRD A9.

## Verification

Test: submit a clear receipt photo and confirm all five fields are extracted and populated.

## Traces to

- [[prob-1/concept-1]] — Chosen approach, receipt parsing via hosted OCR API
- [[prob-1]] — Problem

## Metadata

```json
{
  "id": "REQ-3",
  "title": "Extract structured data from a valid receipt photo",
  "pattern": "event-driven",
  "statement": "When a valid check photo is received, the receipt digitization service shall extract the merchant name, transaction date, transaction time, line items, and total amount.",
  "rationale": "This is the core value proposition: turning a receipt photo into structured, item-level data.",
  "priority": "must",
  "verification": "test",
  "traces_to": ["prob-1/concept-1", "prob-1"]
}
```
