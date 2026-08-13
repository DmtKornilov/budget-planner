Feature: Route unparseable receipts to manual review

  Scenario: Successfully parsed receipt is included normally
    Given the user submits a photo where both the total amount and the transaction date are clearly visible
    When the agent attempts to parse the photo
    Then the agent should not mark the receipt as "requires manual review"
    And the receipt should be included in automatic budget calculations

  Scenario: Missing total amount triggers manual review
    Given the user submits a photo where the total amount is not visible
    When the agent attempts to parse the photo
    Then the agent should mark the receipt as "requires manual review"
    And the receipt should be excluded from automatic budget calculations

  Scenario: Missing transaction date triggers manual review
    Given the user submits a photo where the transaction date is not visible
    When the agent attempts to parse the photo
    Then the agent should mark the receipt as "requires manual review"
    And the receipt should be excluded from automatic budget calculations

  Scenario: Missing both total amount and transaction date triggers a single manual review marking
    Given the user submits a photo where neither the total amount nor the transaction date is visible
    When the agent attempts to parse the photo
    Then the agent should mark the receipt as "requires manual review" exactly once
    And the receipt should be excluded from automatic budget calculations
