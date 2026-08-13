## Feature

Provide an Uncategorized fallback category.

## Narrative

As a user, I want unrecognized items to land somewhere visible rather than being dropped or mis-filed, so I can review and fix them.

## Scenarios

```gherkin
Feature: Provide an Uncategorized fallback category

  Scenario: Uncategorized is available before any receipts exist
    Given a new user account with no receipts uploaded yet
    When the user views the available spending categories
    Then "Uncategorized" should be listed as an available category

  Scenario: Uncategorized remains available for assignment
    Given the category taxonomy includes default categories
    When a line item cannot be confidently classified
    Then "Uncategorized" should be selectable as its category
```

## Traceability

- [[prob-1/concept-1/req-8]] — the requirement these scenarios verify
