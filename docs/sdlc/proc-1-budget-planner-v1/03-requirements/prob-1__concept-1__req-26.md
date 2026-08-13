## Requirement

While the user has fewer than the configured minimum number of receipts on record, the goal-advice service shall withhold specific recommendations.

## Rationale

Split from REQ-21 to keep each requirement to a single capability. Complements informing the user (REQ-21): the service must not generate a recommendation at all while data is insufficient, not merely warn and proceed anyway. Derived from BRD F5.

## Verification

Test: with fewer than the configured minimum receipts on record, request advice and confirm no specific recommendation is returned.

## Traces to

- [[prob-1/concept-1]] — Chosen approach, LLM API for goal-based advice

## Metadata

```json
{
  "id": "REQ-26",
  "title": "Withhold recommendations when data is insufficient",
  "pattern": "state-driven",
  "statement": "While the user has fewer than the configured minimum number of receipts on record, the goal-advice service shall withhold specific recommendations.",
  "rationale": "The service must not generate a recommendation at all while data is insufficient, not merely warn and proceed anyway.",
  "priority": "could",
  "verification": "test",
  "traces_to": ["prob-1/concept-1"]
}
```
