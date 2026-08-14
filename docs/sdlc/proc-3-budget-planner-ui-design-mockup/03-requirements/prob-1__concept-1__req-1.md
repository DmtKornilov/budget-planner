## Requirement

The application shall define a single shared set of design tokens — a color palette, a typography scale, and a spacing scale — used consistently across the home, receipts list, budget summary, and line-item category editor screens.

## Rationale

The concept's chosen approach ([[prob-1/concept-1]] Chosen approach) is a global stylesheet of CSS custom-property tokens plus per-screen CSS Modules that draw on them. Without one shared token source, each screen would invent its own values and the result would not read as one cohesive app, which is the core outcome named in [[prob-1]] (What changes).

## Verification

Inspection: confirm `app/globals.css` (or equivalent) defines the token set as CSS custom properties and is imported once from `app/layout.tsx`, and that no screen hardcodes a competing color/spacing/type value outside the tokens.

## Traces to

- [[prob-1/concept-1]] — Chosen approach

## Metadata

```json
{
  "id": "UI-1",
  "title": "Shared design tokens",
  "pattern": "ubiquitous",
  "statement": "The application shall define a single shared set of design tokens — a color palette, a typography scale, and a spacing scale — used consistently across the home, receipts list, budget summary, and line-item category editor screens.",
  "rationale": "Establishes the single token source the chosen CSS Modules approach depends on, so the four screens read as one app rather than four independently styled pages.",
  "priority": "must",
  "verification": "inspection",
  "traces_to": ["prob-1/concept-1"]
}
```
