## Requirement

The application shall style the budget summary screen's total amount, incomplete-month indicator, and excluded-receipt count using the shared design tokens.

## Rationale

The budget summary is one of the four in-scope screens and, per the confirmed `who-is-affected` answer in [[prob-1]], is one of the two screens checked most often (alongside the receipts list).

## Verification

Demonstration: render the budget summary screen for a month with receipts and visually confirm the total, the bolded "(incomplete — month in progress)" suffix when applicable, and the excluded-count message use the shared tokens.

## Traces to

- [[prob-1/concept-1]] — Chosen approach

## Metadata

```json
{
  "id": "UI-4",
  "title": "Style budget summary screen",
  "pattern": "ubiquitous",
  "statement": "The application shall style the budget summary screen's total amount, incomplete-month indicator, and excluded-receipt count using the shared design tokens.",
  "rationale": "The budget summary is explicitly in scope and is one of the two most frequently checked screens.",
  "priority": "must",
  "verification": "demonstration",
  "traces_to": ["prob-1/concept-1"]
}
```
