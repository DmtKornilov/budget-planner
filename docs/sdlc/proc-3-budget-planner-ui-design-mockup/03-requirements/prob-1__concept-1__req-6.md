## Requirement

If the receipts list screen has no receipts to display, then the application shall show the existing empty-state message styled using the shared design tokens.

## Rationale

Per the confirmed `failure-behaviour` answer: existing empty/error states get visually designed, no new ones are introduced. The receipts list's current empty-state text ("No receipts yet. Digitize a receipt to see it here.") must not be left as unstyled default text while everything else is redesigned.

## Verification

Demonstration: render the receipts list screen with zero receipts and visually confirm the empty-state message uses the shared tokens rather than unstyled text.

## Traces to

- [[prob-1/concept-1]] — Chosen approach

## Metadata

```json
{
  "id": "UI-6",
  "title": "Style receipts-list empty state",
  "pattern": "unwanted-behaviour",
  "statement": "If the receipts list screen has no receipts to display, then the application shall show the existing empty-state message styled using the shared design tokens.",
  "rationale": "Answers the failure-behaviour question: the existing empty state must be styled, not replaced or left bare.",
  "priority": "must",
  "verification": "demonstration",
  "traces_to": ["prob-1/concept-1"]
}
```
