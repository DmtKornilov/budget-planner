Feature: Flag low-confidence extracted fields

  Scenario: A field read with acceptable confidence is accepted normally
    Given the user submits a clear receipt photo
    When the agent parses the photo
    And the confidence score for the total amount is at or above the acceptable threshold
    Then the agent should accept the total amount field without a low-confidence flag

  Scenario: A field exactly at the confidence threshold is not flagged
    Given the user submits a receipt photo
    When the agent parses the photo
    And the confidence score for the merchant name is exactly at the acceptable threshold
    Then the agent should accept the merchant name field without a low-confidence flag

  Scenario: Flag a single low-confidence field
    Given the user submits a blurry receipt photo
    When the agent parses the photo
    And the confidence score for the total amount is below the acceptable threshold
    Then the agent should mark the total amount field as "low confidence"

  Scenario: Flag multiple low-confidence fields independently
    Given the user submits a receipt photo where both the merchant name and the total amount are hard to read
    When the agent parses the photo
    And the confidence scores for both fields are below the acceptable threshold
    Then the agent should mark the merchant name field as "low confidence"
    And the agent should mark the total amount field as "low confidence"
