Feature: Withhold recommendations when data is insufficient

  Scenario: No specific recommendation while data is below the configured minimum
    Given the user has only 3 receipts total, all from the current week
    When the user requests optimization advice
    Then the agent should not generate a specific recommendation
