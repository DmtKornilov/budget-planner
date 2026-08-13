## Feature

Remove deleted receipts from calculations immediately.

## Narrative

As a user, when I delete a receipt, I want my totals to reflect that right away, not after a reload.

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

- [[prob-1/concept-1/req-24]] — the requirement these scenarios verify
