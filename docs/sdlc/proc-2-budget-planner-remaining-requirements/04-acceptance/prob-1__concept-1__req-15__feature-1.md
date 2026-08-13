## Feature

Report no-data periods explicitly

## Narrative

As a user
I want to be told when a requested period has no receipts, not shown a silent zero that looks like real data
So that I never mistake missing data for zero spending

## Scenarios

```gherkin
Feature: Report no-data periods explicitly

  Scenario: Request statistics for a period with data
    Given the user has receipts dated in June 2026
    When the user requests category statistics for June 2026
    Then the agent should return the normal category breakdown
    And the agent should not report that no receipts were found

  Scenario: Request statistics for a period with exactly one receipt
    Given the user has exactly one receipt dated in April 2026
    When the user requests category statistics for April 2026
    Then the agent should return the normal category breakdown for that one receipt
    And the agent should not report that no receipts were found

  Scenario: Request statistics for a period with no data
    Given the user has no receipts dated in March 2025
    When the user requests category statistics for March 2025
    Then the agent should inform the user that no receipts were found for that period
```

## Traceability

Verifies [[prob-1/concept-1/req-15]].
