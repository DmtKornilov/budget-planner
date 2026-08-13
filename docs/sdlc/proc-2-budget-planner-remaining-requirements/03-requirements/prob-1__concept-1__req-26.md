## Requirement

The system shall provide a monthly budget summary screen that displays the month-to-date total labeled as incomplete while the month is in progress and displays the count of receipts excluded as requires-manual-review.

## Rationale

Directly answers the `ui-scope` question: the monthly budget total (REQ-12 through REQ-14) and the excluded-receipt count (REQ-25) must be reachable through a working screen, not only through API routes, per the confirmed `must-have` answer's addition of a UI requirement.

## Verification

Test: load the monthly budget summary screen during an in-progress month with one excluded receipt and confirm the total is labeled incomplete and the excluded count is displayed.

## Traces to

- [[prob-1/concept-1]] — Chosen approach

## Metadata

```json
{
  "id": "REQ-30",
  "title": "Provide a working monthly budget summary screen",
  "pattern": "ubiquitous",
  "statement": "The system shall provide a monthly budget summary screen that displays the month-to-date total labeled as incomplete while the month is in progress and displays the count of receipts excluded as requires-manual-review.",
  "rationale": "The monthly budget total and excluded-receipt count must be reachable through a working screen, not only through API routes, per the confirmed must-have answer.",
  "priority": "must",
  "verification": "test",
  "traces_to": ["prob-1/concept-1"]
}
```
