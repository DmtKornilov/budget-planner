Feature: Withhold recommendations when data is insufficient

  Scenario: A specific recommendation is generated when data is sufficient
    Given the user has at least the configured minimum number of receipts on record
    When the user requests optimization advice
    Then the agent should generate a specific recommendation

  Scenario: A specific recommendation is generated when receipt count exactly meets the minimum
    Given the user's receipt count exactly equals the configured minimum required for advice
    When the user requests optimization advice
    Then the agent should generate a specific recommendation

  Scenario: No specific recommendation while data is below the configured minimum
    Given the user has only 3 receipts total, all from the current week
    When the user requests optimization advice
    Then the agent should not generate a specific recommendation
