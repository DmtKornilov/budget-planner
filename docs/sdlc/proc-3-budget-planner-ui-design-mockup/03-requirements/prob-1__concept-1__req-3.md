## Requirement

The application shall style the receipts list screen's receipt sections and line-item table using the shared design tokens.

## Rationale

The receipts list is one of the four in-scope screens. Per the `existing-behaviour` research, this screen has no upload UI today (digitization happens only via a direct API call) — this requirement covers only the existing list/table content, not an upload affordance that does not exist in the current codebase.

## Verification

Demonstration: render the receipts list screen with at least one receipt present and visually confirm the merchant/date heading, the "(requires manual review)" suffix where applicable, and the line-item table use the shared tokens.

## Traces to

- [[prob-1/concept-1]] — Chosen approach

## Metadata

```json
{
  "id": "UI-3",
  "title": "Style receipts list screen",
  "pattern": "ubiquitous",
  "statement": "The application shall style the receipts list screen's receipt sections and line-item table using the shared design tokens.",
  "rationale": "The receipts list is explicitly in scope; deliberately scoped to the list/table content only since no upload UI exists in the codebase today.",
  "priority": "must",
  "verification": "demonstration",
  "traces_to": ["prob-1/concept-1"]
}
```
