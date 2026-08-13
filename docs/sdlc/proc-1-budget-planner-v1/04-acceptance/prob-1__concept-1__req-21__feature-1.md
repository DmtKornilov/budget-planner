## Feature

Inform the user when historical data is insufficient.

## Narrative

As a user, if I haven't used the app long enough for meaningful advice, I want to be told that plainly rather than getting a guess dressed up as a recommendation.

## Scenarios

```gherkin
Feature: Inform the user when historical data is insufficient

  Scenario: Insufficient data for advice
    Given the user has only 3 receipts total, all from the current week
    When the user requests optimization advice
    Then the agent should inform the user that more historical data is needed
```

## Traceability

- [[prob-1/concept-1/req-21]] — the requirement these scenarios verify
