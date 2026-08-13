Feature: Surface a generic error on OCR/LLM API failure

  Scenario: OCR API failure surfaces a generic error
    Given the OCR API times out while parsing a submitted receipt photo
    When the user views the result
    Then the user should see a message prompting them to try again
    And no automatic retry should occur

  Scenario: LLM API failure surfaces a generic error
    Given the LLM API times out while categorizing a parsed receipt
    When the user views the result
    Then the user should see a message prompting them to try again
    And no automatic retry should occur
