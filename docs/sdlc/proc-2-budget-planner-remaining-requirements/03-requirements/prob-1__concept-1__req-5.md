## Requirement

If the categorization confidence for a line item falls below the configured threshold, then the categorization service shall assign that item to the Uncategorized category and flag it for user review.

## Rationale

Directly answers `failure-behaviour`: low-confidence classifications should not be presented as if they were certain. The specific threshold value is not yet defined, consistent with [[prob-1]]'s Open questions.

## Verification

Test: submit an item with an ambiguous or unknown name and confirm it is routed to Uncategorized and flagged.

## Traces to

- [[prob-1/concept-1]] — Chosen approach
- [[prob-1]] — Open questions

## Metadata

```json
{
  "id": "REQ-9",
  "title": "Route low-confidence categorization to Uncategorized",
  "pattern": "unwanted-behaviour",
  "statement": "If the categorization confidence for a line item falls below the configured threshold, then the categorization service shall assign that item to the Uncategorized category and flag it for user review.",
  "rationale": "Low-confidence classifications should not be presented as if they were certain.",
  "priority": "must",
  "verification": "test",
  "traces_to": ["prob-1/concept-1", "prob-1"]
}
```
