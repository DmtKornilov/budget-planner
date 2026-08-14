## Requirement

The application shall style the line-item category editor's category selector using the shared design tokens.

## Rationale

The category editor is the only interactive element in the current app (a `<select>` with a pending/disabled state) and is one of the four in-scope screens per the concept's chosen approach.

## Verification

Demonstration: render the receipts list screen and visually confirm the category `<select>` control (including its disabled/pending appearance while a change is saving) uses the shared tokens.

## Traces to

- [[prob-1/concept-1]] — Chosen approach

## Metadata

```json
{
  "id": "UI-5",
  "title": "Style line-item category editor",
  "pattern": "ubiquitous",
  "statement": "The application shall style the line-item category editor's category selector using the shared design tokens.",
  "rationale": "The category editor is explicitly in scope and is the app's only interactive control, so its states need deliberate styling.",
  "priority": "must",
  "verification": "demonstration",
  "traces_to": ["prob-1/concept-1"]
}
```
