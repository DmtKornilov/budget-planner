## Feature

Style receipts list screen

## Narrative

As the person who uses Budget Planner
I want each receipt and its line items to look designed
So that reviewing my receipts is pleasant instead of reading a plain data dump

## Scenarios

```gherkin
Feature: Style receipts list screen

  Scenario: A single receipt section is styled
    Given the shared design tokens are defined
    And one receipt is recorded for the current user
    When the receipts list screen renders
    Then the receipt's merchant/date heading uses the shared design tokens
    And the receipt's line-item table uses the shared design tokens

  Scenario: Multiple receipt sections are styled consistently
    Given the shared design tokens are defined
    And three receipts are recorded for the current user
    When the receipts list screen renders
    Then all three receipt sections use the same shared design tokens

  Scenario: A receipt requiring manual review is visually distinguished
    Given a receipt has status "manual_review"
    When the receipts list screen renders that receipt
    Then the "(requires manual review)" suffix is styled to stand out from a normal receipt heading

  Scenario: A line-item table with multiple rows is styled consistently
    Given a receipt has five line items
    When the receipts list screen renders that receipt's table
    Then all five rows use the same shared design tokens
```

## Traceability

Verifies [[prob-1/concept-1/req-3]].
