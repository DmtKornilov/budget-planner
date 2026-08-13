Feature: Exclude manual-review receipts from totals

  Scenario: A month with no flagged receipts includes everything normally
    Given the user has 8 valid receipts in September 2026, none flagged "requires manual review"
    When the agent calculates the September 2026 budget
    Then the total should include all 8 valid receipts

  Scenario: Exclude a flagged receipt from an otherwise valid month
    Given the user has 10 valid receipts and 2 receipts flagged "requires manual review" in July 2026
    When the agent calculates the July 2026 budget
    Then the total should only include the 10 valid receipts

  Scenario: All receipts flagged results in a zero total
    Given the user has 3 receipts in August 2026, all flagged "requires manual review"
    When the agent calculates the August 2026 budget
    Then the total should be zero
