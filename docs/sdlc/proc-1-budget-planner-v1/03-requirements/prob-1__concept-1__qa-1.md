## Requirement

While the system is under normal (non-concurrent-load) operating conditions, the receipt digitization service shall return a parsing result of success, flagged, or failure within the stated threshold.

## Rationale

This is the one confirmed hard number for the MVP (answer to `thresholds`) — every other non-functional target (accuracy, manual-review rate, uptime, concurrent-user volume) was explicitly left as unknown rather than invented, per the same answer. Derived from BRD N4.

## Measure

| | |
|---|---|
| metric | end-to-end parsing response time from photo submission to result |
| threshold | 10 seconds |
| conditions | for a single receipt, under normal (non-concurrent-load) conditions; no concurrent-user volume target is defined (see [[prob-1]] Open questions) |

## Traces to

- [[prob-1/concept-1]] — Chosen approach, receipt parsing via hosted OCR API
- [[prob-1]] — Open questions

## Metadata

```json
{
  "id": "BP-NFR-1",
  "title": "Receipt parsing response time",
  "category": "performance",
  "statement": "While the system is under normal (non-concurrent-load) operating conditions, the receipt digitization service shall return a parsing result of success, flagged, or failure within the stated threshold.",
  "measure": {
    "metric": "end-to-end parsing response time from photo submission to result",
    "threshold": "10 seconds",
    "conditions": "for a single receipt, under normal (non-concurrent-load) conditions",
    "method": "test"
  },
  "rationale": "This is the one confirmed hard number for the MVP; every other non-functional target was explicitly left unknown rather than invented.",
  "priority": "must",
  "traces_to": ["prob-1/concept-1", "prob-1"]
}
```
