Feature: Aggregate monthly spend from valid receipts

  Scenario: Calculate a completed month's total
    Given the user has 15 fully parsed and categorized receipts dated in June 2026
    When the user requests the June 2026 budget summary
    Then the agent should return the sum of all line-item totals for June 2026

  Scenario: Use transaction date, not upload date, for month assignment
    Given a receipt transaction-dated June 28, 2026 was uploaded on July 2, 2026
    When the user requests the June 2026 budget summary
    Then that receipt's total should be included in June 2026, not July 2026

  Scenario: A month with no receipts returns a zero total
    Given the user has no receipts dated in March 2025
    When the user requests the March 2025 budget summary
    Then the agent should return a total of zero for that month

  Scenario: Flagged receipts within the month are excluded from the total
    Given the user has 5 valid receipts and 1 receipt flagged "requires manual review", all dated in June 2026
    When the user requests the June 2026 budget summary
    Then the returned total should include only the 5 valid receipts
    And the flagged receipt's amount should not be included
