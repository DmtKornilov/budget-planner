Feature: Report no-data periods explicitly

  Scenario: Request statistics for a period with no data
    Given the user has no receipts dated in March 2025
    When the user requests category statistics for March 2025
    Then the agent should inform the user that no receipts were found for that period
