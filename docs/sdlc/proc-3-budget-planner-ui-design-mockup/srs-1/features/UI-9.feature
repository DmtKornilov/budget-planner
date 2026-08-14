Feature: Preserve existing functional behavior

  Scenario: The full test suite passes unchanged after the visual design work
    Given the visual design work described in this piece of work has been applied
    When the existing automated test suite is run
    Then every test that passed before the visual design work still passes
    And no test was modified to accommodate a behavior change

  Scenario: Receipt display still shows the same data
    Given a receipt with line items existed before the visual design work
    When the receipts list screen renders that receipt after the visual design work
    Then the same merchant, date, line items, totals, and category values are shown as before

  Scenario: Category reassignment still works the same way
    Given the visual design work has been applied to the category editor
    When a line item's category is changed
    Then the same PATCH request and success/failure behavior occurs as before the visual design work

  Scenario: Budget calculation still produces the same result
    Given a set of receipts for a given month existed before the visual design work
    When the budget summary screen calculates the total for that month after the visual design work
    Then the calculated total, incomplete flag, and excluded count match what they were before
