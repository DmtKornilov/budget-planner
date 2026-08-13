## Requirement

If the OCR confidence for a required extracted field falls below the configured threshold, then the receipt digitization service shall flag that field as low confidence.

## Rationale

Prevents bad OCR data from silently corrupting the budget, per [[prob-1]]'s stated problem. The specific threshold value is not yet defined (per the confirmed `thresholds` answer) and is deliberately left configurable rather than invented here.

## Verification

Test: submit a low-quality photo of a receipt with a partially obscured field and confirm it is flagged as low confidence rather than silently accepted.

## Traces to

- [[prob-1/concept-1]] — Chosen approach
- [[prob-1]] — Open questions

## Metadata

```json
{
  "id": "REQ-4",
  "title": "Flag low-confidence extracted fields",
  "pattern": "unwanted-behaviour",
  "statement": "If the OCR confidence for a required extracted field falls below the configured threshold, then the receipt digitization service shall flag that field as low confidence.",
  "rationale": "Prevents bad OCR data from silently corrupting the budget. The specific threshold is not yet defined and is left configurable rather than invented.",
  "priority": "must",
  "verification": "test",
  "traces_to": ["prob-1/concept-1", "prob-1"]
}
```
