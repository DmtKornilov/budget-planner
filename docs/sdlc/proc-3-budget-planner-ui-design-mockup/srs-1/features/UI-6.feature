Feature: Style receipts-list empty state

  Scenario: The empty-state message is styled when there are no receipts
    Given the shared design tokens are defined
    And no receipts are recorded for the current user
    When the receipts list screen renders
    Then the "No receipts yet. Digitize a receipt to see it here." message uses the shared design tokens

  Scenario: The empty-state message disappears once a receipt exists
    Given no receipts are recorded for the current user
    When one receipt is recorded and the receipts list screen renders again
    Then the empty-state message is not shown
    And the recorded receipt is shown instead
