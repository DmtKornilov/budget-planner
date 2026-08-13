## Feature

Withhold recommendations when data is insufficient.

## Narrative

As a user, I don't want a confident-sounding recommendation generated from too little history, so the system should hold back rather than guess.

## Scenarios

```gherkin
Feature: Withhold recommendations when data is insufficient

  Scenario: No specific recommendation while data is below the configured minimum
    Given the user has only 3 receipts total, all from the current week
    When the user requests optimization advice
    Then the agent should not generate a specific recommendation
```

## Traceability

- [[prob-1/concept-1/req-26]] — the requirement these scenarios verify
