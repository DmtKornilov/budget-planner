## Feature

Report no-data periods explicitly.

## Narrative

As a user, if I ask for statistics on a period with nothing in it, I want to be told so, not shown a silent zero that looks like real data.

## Scenarios

```gherkin
Feature: Report no-data periods explicitly

  Scenario: Request statistics for a period with no data
    Given the user has no receipts dated in March 2025
    When the user requests category statistics for March 2025
    Then the agent should inform the user that no receipts were found for that period
```

## Traceability

- [[prob-1/concept-1/req-19]] — the requirement these scenarios verify
