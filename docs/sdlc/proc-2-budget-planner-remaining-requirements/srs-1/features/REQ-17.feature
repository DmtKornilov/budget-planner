Feature: Allow manual override of position-match results

  Scenario: Override an automatic same-position determination
    Given the agent classified two positions as "same position"
    When the user marks the pair as "different position"
    Then the agent should update the stored classification to "different position"

  Scenario: Override an automatic different-position determination
    Given the agent classified two positions as "different position"
    When the user marks the pair as "same position"
    Then the agent should update the stored classification to "same position"

  Scenario: Manual override persists across a later automatic re-comparison
    Given the user has manually overridden a pair's classification to "different position"
    When the position-matching service later re-runs its automatic comparison for that pair
    Then the stored classification should remain "different position"
    And the automatic re-comparison should not silently overwrite the user's manual override
