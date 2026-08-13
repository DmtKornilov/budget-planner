## Requirement

The categorization service shall provide an Uncategorized fallback category for line items it cannot confidently classify.

## Rationale

Guarantees every line item has a category value even when automatic classification fails, so reports never silently drop items. Derived from BRD C2.

## Verification

Inspection: confirm the category taxonomy includes an Uncategorized entry available for assignment.

## Traces to

- [[prob-1/concept-1]] — Chosen approach, LLM API for categorization

## Metadata

```json
{
  "id": "REQ-8",
  "title": "Provide an Uncategorized fallback",
  "pattern": "ubiquitous",
  "statement": "The categorization service shall provide an Uncategorized fallback category for line items it cannot confidently classify.",
  "rationale": "Guarantees every line item has a category value even when automatic classification fails.",
  "priority": "must",
  "verification": "inspection",
  "traces_to": ["prob-1/concept-1"]
}
```
