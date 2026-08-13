## Feature

Remove deleted receipts from calculations immediately

## Narrative

As a user
I want my totals to reflect a deleted receipt right away, not after a reload
So that I never see a total that's still distorted by something I just removed

## Scenarios

```gherkin
Feature: Remove deleted receipts from calculations immediately

  Scenario: Deleting one of several receipts updates the visible total
    Given the user has three receipts in the current month totaling 150 PLN
    When the user deletes one receipt worth 50 PLN
    Then the visible month-to-date total should update to 100 PLN within the same session

  Scenario: Deleting the last receipt in a month zeroes the total
    Given the user has one receipt in the current month
    When the user deletes that receipt
    Then the visible month-to-date total should update to zero within the same session
```

## Traceability

Verifies [[prob-1/concept-1/req-20]].
