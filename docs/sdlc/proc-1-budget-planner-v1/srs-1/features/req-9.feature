Feature: Route low-confidence categorization to Uncategorized

  Scenario: Fallback to Uncategorized for unrecognized item
    Given a parsed receipt contains an item with an ambiguous or unknown name
    When the agent attempts to categorize it
    And the categorization confidence is below the acceptable threshold
    Then the item should be assigned to "Uncategorized"
    And flagged for user review
