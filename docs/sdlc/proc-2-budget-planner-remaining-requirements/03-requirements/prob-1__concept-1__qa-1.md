## Requirement

While the system is under normal (non-concurrent-load) operating conditions, the receipt digitization service shall return a parsing result of success, flagged, or failure within the stated threshold.

## Rationale

This is the one confirmed hard number for this process (per the `thresholds` answer) — every other non-functional target named in this stage (OCR-confidence, categorization-confidence, minimum-receipts-for-advice) was explicitly left as unknown/configuration rather than invented, per the same answer.

## Measure

| | |
|---|---|
| metric | end-to-end parsing response time from photo submission to result |
| threshold | 10 seconds |
| conditions | for a single receipt, under normal (non-concurrent-load) conditions; no concurrent-user volume target is defined (see [[prob-1]] Open questions) |

## Traces to

- [[prob-1/concept-1]] — Chosen approach
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
  "rationale": "This is the one confirmed hard number for this process; every other non-functional target was explicitly left unknown rather than invented.",
  "priority": "must",
  "traces_to": ["prob-1/concept-1", "prob-1"]
}
```
