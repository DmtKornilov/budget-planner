Feature: Allow manual override of position-match results

  Scenario: Override an automatic same-position determination
    Given the agent classified two positions as "same position"
    When the user marks the pair as "different position"
    Then the agent should update the stored classification to "different position"

  Scenario: Override an automatic different-position determination
    Given the agent classified two positions as "different position"
    When the user marks the pair as "same position"
    Then the agent should update the stored classification to "same position"
