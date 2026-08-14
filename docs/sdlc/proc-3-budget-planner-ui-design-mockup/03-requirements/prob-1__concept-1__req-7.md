## Requirement

If the budget summary screen has no receipts recorded for the selected month, then the application shall show the existing empty-state message styled using the shared design tokens.

## Rationale

Per the confirmed `failure-behaviour` answer: existing empty/error states get visually designed, no new ones are introduced. The budget summary's current empty-state text ("No receipts recorded for this month yet.") must not be left as unstyled default text.

## Verification

Demonstration: render the budget summary screen for a month with zero receipts and visually confirm the empty-state message uses the shared tokens.

## Traces to

- [[prob-1/concept-1]] — Chosen approach

## Metadata

```json
{
  "id": "UI-7",
  "title": "Style budget-summary empty state",
  "pattern": "unwanted-behaviour",
  "statement": "If the budget summary screen has no receipts recorded for the selected month, then the application shall show the existing empty-state message styled using the shared design tokens.",
  "rationale": "Answers the failure-behaviour question: the existing empty state must be styled, not replaced or left bare.",
  "priority": "must",
  "verification": "demonstration",
  "traces_to": ["prob-1/concept-1"]
}
```
