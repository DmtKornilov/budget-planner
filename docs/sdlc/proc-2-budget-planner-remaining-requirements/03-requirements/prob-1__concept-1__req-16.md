## Requirement

The goal-advice service shall allow the user to define a financial goal or a lifestyle goal.

## Rationale

A goal is the input the advice engine needs to produce anything specific, per BR-6's business intent. Priority is could per the confirmed `must-have` answer — this is the first area to slip if time runs short.

## Verification

Test: create both a financial goal and a lifestyle goal via the API and confirm both are stored against the user's account.

## Traces to

- [[prob-1/concept-1]] — Chosen approach

## Metadata

```json
{
  "id": "REQ-20",
  "title": "Allow the user to define a financial or lifestyle goal",
  "pattern": "ubiquitous",
  "statement": "The goal-advice service shall allow the user to define a financial goal or a lifestyle goal.",
  "rationale": "A goal is the input the advice engine needs to produce anything specific.",
  "priority": "could",
  "verification": "test",
  "traces_to": ["prob-1/concept-1"]
}
```
