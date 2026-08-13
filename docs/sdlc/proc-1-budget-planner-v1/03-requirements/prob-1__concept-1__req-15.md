## Requirement

When two check photos suspected to be of the same physical receipt are compared, the position-matching service shall classify a pair of line items as same-position only if item name, unit price, quantity, and total price all match exactly.

## Rationale

Prevents double-counting a long receipt split across multiple photos, per BR-2's business intent. Priority is should, not must, per the confirmed `must-have` answer (BR-2 could slip to a later iteration under time pressure). Derived from BRD B2/B3.

## Verification

Test: submit two overlapping photos of one long receipt with a shared item and confirm the shared item is classified as same-position.

## Traces to

- [[prob-1/concept-1]] — Chosen approach

## Metadata

```json
{
  "id": "REQ-15",
  "title": "Detect same-position items across photos of one receipt",
  "pattern": "event-driven",
  "statement": "When two check photos suspected to be of the same physical receipt are compared, the position-matching service shall classify a pair of line items as same-position only if item name, unit price, quantity, and total price all match exactly.",
  "rationale": "Prevents double-counting a long receipt split across multiple photos.",
  "priority": "should",
  "verification": "test",
  "traces_to": ["prob-1/concept-1"]
}
```
