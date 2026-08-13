Feature: Report no-data periods explicitly

  Scenario: Request statistics for a period with data
    Given the user has receipts dated in June 2026
    When the user requests category statistics for June 2026
    Then the agent should return the normal category breakdown
    And the agent should not report that no receipts were found

  Scenario: Request statistics for a period with exactly one receipt
    Given the user has exactly one receipt dated in April 2026
    When the user requests category statistics for April 2026
    Then the agent should return the normal category breakdown for that one receipt
    And the agent should not report that no receipts were found

  Scenario: Request statistics for a period with no data
    Given the user has no receipts dated in March 2025
    When the user requests category statistics for March 2025
    Then the agent should inform the user that no receipts were found for that period
