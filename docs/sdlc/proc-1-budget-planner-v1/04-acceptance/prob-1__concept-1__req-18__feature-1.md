## Feature

Provide ranked category statistics for a date range.

## Narrative

As a user, I want to see how my spending breaks down by category, ranked by where most of my money goes, so I can spot patterns.

## Scenarios

```gherkin
Feature: Provide ranked category statistics for a date range

  Scenario: Retrieve category breakdown for a calendar month
    Given the user has categorized receipts for July 2026
    When the user requests category statistics for July 2026
    Then the agent should return total spend, percentage share, and transaction count for each category
    And categories should be ranked from highest to lowest spend

  Scenario: Retrieve category breakdown for a custom date range
    Given the user has receipts spanning multiple months
    When the user requests statistics from July 10, 2026 to July 24, 2026
    Then the agent should return category totals limited to that date range
    And categories should be ranked from highest to lowest spend
```

## Traceability

- [[prob-1/concept-1/req-18]] — the requirement these scenarios verify
