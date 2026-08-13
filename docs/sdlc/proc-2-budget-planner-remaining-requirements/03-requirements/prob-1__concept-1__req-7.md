## Requirement

When a user manually reassigns a line item's category, the categorization service shall store the correction and apply it to future line items with the same name from the same merchant.

## Rationale

Without this, users would have to re-correct the same recurring item every time it appears on a new receipt, undermining the low-effort promise in [[prob-1]]'s Problem section.

## Verification

Test: correct an item's category, then submit a new receipt from the same merchant with the same item name, and confirm the correction is applied automatically.

## Traces to

- [[prob-1/concept-1]] — Chosen approach
- [[prob-1]] — Problem

## Metadata

```json
{
  "id": "REQ-11",
  "title": "Learn from manual category corrections",
  "pattern": "event-driven",
  "statement": "When a user manually reassigns a line item's category, the categorization service shall store the correction and apply it to future line items with the same name from the same merchant.",
  "rationale": "Without this, users would have to re-correct the same recurring item every time it appears, undermining the low-effort promise.",
  "priority": "must",
  "verification": "test",
  "traces_to": ["prob-1/concept-1", "prob-1"]
}
```
