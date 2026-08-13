## Requirement

The categorization service shall allow the user to manually reassign the category of any line item.

## Rationale

Automatic categorization will be wrong sometimes; the user must be able to correct it. Derived from BRD C4.

## Verification

Test: reassign the category of a line item via the UI and confirm the change is stored and reflected in subsequent views.

## Traces to

- [[prob-1/concept-1]] — Chosen approach, LLM API for categorization

## Metadata

```json
{
  "id": "REQ-10",
  "title": "Allow manual category reassignment",
  "pattern": "ubiquitous",
  "statement": "The categorization service shall allow the user to manually reassign the category of any line item.",
  "rationale": "Automatic categorization will be wrong sometimes; the user must be able to correct it.",
  "priority": "must",
  "verification": "test",
  "traces_to": ["prob-1/concept-1"]
}
```
