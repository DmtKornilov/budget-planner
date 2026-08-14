## Requirement

If a line-item category change fails to save, then the application shall show the existing inline error message styled using the shared design tokens.

## Rationale

Per the confirmed `failure-behaviour` answer: the category editor's existing inline error ("Could not save the category change. Please try again.") gets visually designed consistent with the rest of the UI, without introducing new error handling.

## Verification

Demonstration: trigger a failed category save (e.g. by simulating a failed PATCH response) and visually confirm the inline error message uses the shared tokens.

## Traces to

- [[prob-1/concept-1]] — Chosen approach

## Metadata

```json
{
  "id": "UI-8",
  "title": "Style category-save error state",
  "pattern": "unwanted-behaviour",
  "statement": "If a line-item category change fails to save, then the application shall show the existing inline error message styled using the shared design tokens.",
  "rationale": "Answers the failure-behaviour question: the existing inline error state must be styled, not replaced or left bare.",
  "priority": "must",
  "verification": "demonstration",
  "traces_to": ["prob-1/concept-1"]
}
```
