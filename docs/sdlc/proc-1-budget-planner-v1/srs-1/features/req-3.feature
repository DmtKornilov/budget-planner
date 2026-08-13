Feature: Extract structured data from a valid receipt photo

  Scenario: Extract all fields from a single-item receipt
    Given the user has a clear photo of a receipt with one line item
    When the user submits the photo
    Then the agent should extract the merchant name, transaction date, transaction time, the line item, and the total amount

  Scenario: Extract all line items from a multi-item receipt
    Given the user has a clear photo of a receipt with five line items
    When the user submits the photo
    Then the agent should extract the merchant name, transaction date, transaction time, and total amount
    And all five line items should be present in the extracted result, not only the first
