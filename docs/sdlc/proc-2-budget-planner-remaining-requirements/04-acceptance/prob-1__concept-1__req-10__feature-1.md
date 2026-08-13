## Feature

Label in-progress month totals as incomplete

## Narrative

As a user
I don't want to mistake a partial month for a final one
So I can tell at a glance whether this month's total is still building up

## Scenarios

```gherkin
Feature: Label in-progress month totals as incomplete

  Scenario: Calculate an in-progress month's budget
    Given the current date is July 27, 2026
    And the user has receipts dated from July 1 to July 27, 2026
    When the user requests the July 2026 budget summary
    Then the agent should return a month-to-date total
    And clearly label it as incomplete

  Scenario: A completed month is not labeled incomplete
    Given the current date is August 5, 2026
    And the user has receipts dated throughout June 2026
    When the user requests the June 2026 budget summary
    Then the agent should return the June 2026 total
    And it should not be labeled as incomplete
```

## Traceability

Verifies [[prob-1/concept-1/req-10]].
