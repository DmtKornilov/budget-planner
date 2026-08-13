Feature: Provide an Uncategorized fallback category

  Scenario: Uncategorized is available before any receipts exist
    Given a new user account with no receipts uploaded yet
    When the user views the available spending categories
    Then "Uncategorized" should be listed as an available category

  Scenario: Uncategorized remains available for assignment
    Given the category taxonomy includes default categories
    When a line item cannot be confidently classified
    Then "Uncategorized" should be selectable as its category
