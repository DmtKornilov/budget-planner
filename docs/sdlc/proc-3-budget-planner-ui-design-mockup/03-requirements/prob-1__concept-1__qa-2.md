## Requirement

While the design tokens define text and background colors, the application shall provide a contrast ratio between body text and its background that meets the stated threshold.

## Rationale

The confirmed `thresholds` answer was initially "none known". A WCAG AA target (4.5:1 normal text, 3:1 large text/headings) was proposed as a sensible, checkable default and then confirmed by the user via the `contrast-target` question as a tracked requirement, not merely a suggestion — it costs nothing extra to hit when choosing a token palette deliberately.

## Measure

| | |
|---|---|
| metric | contrast ratio (WCAG relative luminance formula) between each token pairing used for body text and its background, and for large text/heading and its background |
| threshold | 4.5:1 for normal body text; 3:1 for large text and headings |
| conditions | measured against the final color tokens defined in the shared stylesheet, using a standard WCAG contrast calculation |

## Traces to

- [[prob-1/concept-1]] — Chosen approach

## Metadata

```json
{
  "id": "UI-NFR-2",
  "title": "Text contrast",
  "category": "accessibility",
  "statement": "While the design tokens define text and background colors, the application shall provide a contrast ratio between body text and its background that meets the stated threshold.",
  "measure": {
    "metric": "WCAG contrast ratio between text and background color tokens",
    "threshold": "4.5:1 normal text, 3:1 large text/headings",
    "conditions": "measured against the final token palette using the WCAG relative luminance formula",
    "method": "analysis"
  },
  "rationale": "Proposed as a sensible default when no numeric target was given, then confirmed by the user as a tracked requirement via the contrast-target question.",
  "priority": "must",
  "traces_to": ["prob-1/concept-1"]
}
```
