## Feature

Inform the user when historical data is insufficient

## Narrative

As a user
I want to be told plainly when I haven't used the app long enough for meaningful advice
So that I never get a guess dressed up as a recommendation

## Scenarios

```gherkin
Feature: Inform the user when historical data is insufficient

  Scenario: Sufficient data produces real advice
    Given the user has at least the configured minimum number of receipts on record
    When the user requests optimization advice
    Then the agent should return actual optimization advice
    And the agent should not report that more historical data is needed

  Scenario: Receipt count exactly at the configured minimum
    Given the user's receipt count exactly equals the configured minimum required for advice
    When the user requests optimization advice
    Then the agent should return actual optimization advice
    And the agent should not report that more historical data is needed

  Scenario: Insufficient data for advice
    Given the user has only 3 receipts total, all from the current week
    When the user requests optimization advice
    Then the agent should inform the user that more historical data is needed
```

## Traceability

Verifies [[prob-1/concept-1/req-17]].
