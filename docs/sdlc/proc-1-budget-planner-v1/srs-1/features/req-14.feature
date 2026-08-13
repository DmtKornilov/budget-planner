Feature: Label in-progress month totals as incomplete

  Scenario: Calculate an in-progress month's budget
    Given the current date is July 27, 2026
    And the user has receipts dated from July 1 to July 27, 2026
    When the user requests the July 2026 budget summary
    Then the agent should return a month-to-date total
    And clearly label it as incomplete
