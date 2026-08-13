## Feature

Provide a working monthly budget summary screen

## Narrative

As a user
I want to see my month-to-date total and how many receipts are pending review on a real screen
So that the monthly budget total and excluded-receipt count are reachable without calling API routes directly

## Scenarios

```gherkin
Feature: Provide a working monthly budget summary screen

  Scenario: In-progress month with an excluded receipt shows an incomplete total and the excluded count
    Given the current month is in progress and has one receipt excluded as "requires manual review"
    When the user loads the monthly budget summary screen
    Then the month-to-date total should be labeled as incomplete
    And the screen should display the count of excluded receipts

  Scenario: Completed past month with no exclusions is not labeled incomplete
    Given a past, completed month has no receipts excluded as "requires manual review"
    When the user loads the monthly budget summary screen for that month
    Then the total should not be labeled as incomplete
    And the screen should not display an excluded-receipt count

  Scenario: Empty state with no receipts for the month
    Given the user has no receipts recorded for the current month
    When the user loads the monthly budget summary screen
    Then the screen should render an empty or zero state
    And the screen should not show an error
```

## Traceability

Verifies [[prob-1/concept-1/req-26]].
