## Requirement

When a receipt is successfully parsed, the categorization service shall assign a category to each line item from the predefined category taxonomy.

## Rationale

Category assignment is what turns a list of purchases into a budget breakdown — the core of BR-3 and the reason [[prob-1/concept-1]] chose categorization as one of the 6 new service areas.

## Verification

Test: submit a parsed receipt with recognizable items and confirm each line item receives a category from the taxonomy.

## Traces to

- [[prob-1/concept-1]] — Chosen approach

## Metadata

```json
{
  "id": "REQ-7",
  "title": "Categorize line items on successful parse",
  "pattern": "event-driven",
  "statement": "When a receipt is successfully parsed, the categorization service shall assign a category to each line item from the predefined category taxonomy.",
  "rationale": "Category assignment is what turns a list of purchases into a budget breakdown.",
  "priority": "must",
  "verification": "test",
  "traces_to": ["prob-1/concept-1"]
}
```
