Feature: Provide a working receipt list and category correction screen

  Scenario: View and correct a line item's category
    Given the user has digitized receipts with categorized line items
    When the user loads the receipt list screen
    Then each line item should be displayed with its assigned category
    When the user reassigns one line item's category through the screen
    And the user reloads the screen
    Then the line item should show the newly assigned category

  Scenario: Empty state with no receipts yet
    Given the user has no digitized receipts on record
    When the user loads the receipt list screen
    Then the screen should render an empty state
    And the screen should not show an error

  Scenario: Line item with no assigned category is still shown and correctable
    Given the user has a digitized receipt with a line item that has no assigned category yet
    When the user loads the receipt list screen
    Then that line item should still be displayed on the screen
    And the user should be able to assign a category to it through the screen
