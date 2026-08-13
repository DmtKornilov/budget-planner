## Feature

Label in-progress month totals as incomplete.

## Narrative

As a user, I don't want to mistake a partial month for a final one, so the current month's total should say clearly that it's still in progress.

## Scenarios

```gherkin
Feature: Label in-progress month totals as incomplete

  Scenario: Calculate an in-progress month's budget
    Given the current date is July 27, 2026
    And the user has receipts dated from July 1 to July 27, 2026
    When the user requests the July 2026 budget summary
    Then the agent should return a month-to-date total
    And clearly label it as incomplete
```

## Traceability

- [[prob-1/concept-1/req-14]] — the requirement these scenarios verify
