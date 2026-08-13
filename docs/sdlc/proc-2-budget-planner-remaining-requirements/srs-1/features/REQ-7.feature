Feature: Categorize line items on successful parse

  Scenario: Automatically categorize a recognized item
    Given a parsed receipt contains the item "Bananas 1kg"
    When the agent categorizes the receipt
    Then the item should be assigned to the "Groceries" category

  Scenario: Categorize each item on a multi-category receipt independently
    Given a parsed receipt contains "Bananas 1kg", a bus ticket, and a restaurant meal
    When the agent categorizes the receipt
    Then "Bananas 1kg" should be assigned to "Groceries"
    And the bus ticket should be assigned to "Transport"
    And the restaurant meal should be assigned to "Dining"
