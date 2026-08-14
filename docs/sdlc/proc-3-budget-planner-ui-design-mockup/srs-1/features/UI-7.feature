Feature: Style budget-summary empty state

  Scenario: The empty-state message is styled when a month has no receipts
    Given the shared design tokens are defined
    And no receipts are recorded for the selected month
    When the budget summary screen renders
    Then the "No receipts recorded for this month yet." message uses the shared design tokens

  Scenario: The empty-state message disappears once the month has a receipt
    Given no receipts are recorded for the selected month
    When one receipt is recorded for that month and the screen renders again
    Then the empty-state message is not shown
    And the styled total is shown instead

  Scenario: Switching to a different empty month shows the empty state again
    Given the selected month has receipts and shows a total
    When the person switches to a different month with no receipts
    Then the empty-state message is shown for the newly selected month
