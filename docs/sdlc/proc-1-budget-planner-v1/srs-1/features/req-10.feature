Feature: Allow manual category reassignment

  Scenario: Reassign a line item's category
    Given the item "Protein Bar XL" was categorized as "Groceries"
    When the user reassigns it to "Health"
    Then the agent should update the category for that item to "Health"
