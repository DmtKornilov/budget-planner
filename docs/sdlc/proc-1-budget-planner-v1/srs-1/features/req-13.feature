Feature: Exclude manual-review receipts from totals

  Scenario: Exclude a flagged receipt from an otherwise valid month
    Given the user has 10 valid receipts and 2 receipts flagged "requires manual review" in July 2026
    When the agent calculates the July 2026 budget
    Then the total should only include the 10 valid receipts

  Scenario: All receipts flagged results in a zero total
    Given the user has 3 receipts in August 2026, all flagged "requires manual review"
    When the agent calculates the August 2026 budget
    Then the total should be zero
