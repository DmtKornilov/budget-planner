## Requirement

The application shall provide a shared page shell — a consistent page wrapper and heading/navigation treatment — in the root layout, applied across the home, receipts list, budget summary, and line-item category editor screens.

## Rationale

The concept's chosen approach ([[prob-1/concept-1]] Chosen approach) states that `app/layout.tsx` gains a small shared shell so the four screens read as one app rather than four disconnected pages. Without a requirement for this, the shared-shell part of the chosen approach would have no corresponding requirement to build or verify against. This is a presentation-layer addition (consistent chrome/navigation), not a change to receipt display, categorization, or budget calculation, so it does not conflict with [[prob-1/concept-1/req-9]]'s preservation of existing functional behavior.

## Verification

Demonstration: render each of the four screens and visually confirm they share the same page wrapper and heading/navigation treatment defined in the root layout.

## Traces to

- [[prob-1/concept-1]] — Chosen approach

## Metadata

```json
{
  "id": "UI-10",
  "title": "Shared page shell in root layout",
  "pattern": "ubiquitous",
  "statement": "The application shall provide a shared page shell — a consistent page wrapper and heading/navigation treatment — in the root layout, applied across the home, receipts list, budget summary, and line-item category editor screens.",
  "rationale": "Covers the shared-shell part of the concept's chosen approach, which otherwise had no requirement.",
  "priority": "must",
  "verification": "demonstration",
  "traces_to": ["prob-1/concept-1"]
}
```
