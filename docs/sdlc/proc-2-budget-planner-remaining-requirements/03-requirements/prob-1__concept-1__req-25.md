## Requirement

The system shall provide a receipt list screen that displays each digitized receipt's line items with their assigned category and allows the user to manually reassign a line item's category from that screen.

## Rationale

Directly answers the `ui-scope` question: categorization and manual correction (REQ-7 through REQ-11) must be reachable through a working screen, not only through API routes callable via curl, per the confirmed `must-have` answer's addition of a UI requirement.

## Verification

Test: load the receipt list screen, confirm each line item shows its assigned category, reassign one item's category through the screen, and confirm the change persists and is reflected on reload.

## Traces to

- [[prob-1/concept-1]] — Chosen approach

## Metadata

```json
{
  "id": "REQ-29",
  "title": "Provide a working receipt list and category correction screen",
  "pattern": "ubiquitous",
  "statement": "The system shall provide a receipt list screen that displays each digitized receipt's line items with their assigned category and allows the user to manually reassign a line item's category from that screen.",
  "rationale": "Categorization and manual correction must be reachable through a working screen, not only through API routes, per the confirmed must-have answer.",
  "priority": "must",
  "verification": "test",
  "traces_to": ["prob-1/concept-1"]
}
```
