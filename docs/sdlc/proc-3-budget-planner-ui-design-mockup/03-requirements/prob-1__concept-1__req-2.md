## Requirement

The application shall style the home screen's heading, description text, and navigation links using the shared design tokens.

## Rationale

The home screen is one of the four in-scope screens ([[prob-1/concept-1]] Chosen approach lists `app/page.tsx` explicitly) and the must-have answer confirmed all four screens are restyled together, none deferred.

## Verification

Demonstration: render the home screen in a browser and visually confirm the heading, description paragraph, and the two navigation links use the shared tokens rather than unstyled defaults.

## Traces to

- [[prob-1/concept-1]] — Chosen approach

## Metadata

```json
{
  "id": "UI-2",
  "title": "Style home screen",
  "pattern": "ubiquitous",
  "statement": "The application shall style the home screen's heading, description text, and navigation links using the shared design tokens.",
  "rationale": "The home screen is explicitly in scope per the concept's chosen approach and the confirmed must-have answer that all four screens ship together.",
  "priority": "must",
  "verification": "demonstration",
  "traces_to": ["prob-1/concept-1"]
}
```
