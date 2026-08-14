Feature: Style budget summary screen

  Scenario: The monthly total is styled
    Given the shared design tokens are defined
    And receipts are recorded for the selected month
    When the budget summary screen renders
    Then the total amount uses the shared design tokens

  Scenario: The incomplete-month indicator is styled
    Given the selected month is still in progress
    When the budget summary screen renders
    Then the "(incomplete — month in progress)" indicator uses the shared design tokens
    And the indicator remains visually distinguished from the total amount

  Scenario: A complete month shows no incomplete indicator
    Given the selected month has fully elapsed
    When the budget summary screen renders
    Then no incomplete-month indicator is shown

  Scenario: The excluded-receipt count is styled when present
    Given at least one receipt for the selected month is excluded pending review
    When the budget summary screen renders
    Then the excluded-receipt count message uses the shared design tokens

  Scenario: No excluded-receipt message when there are no exclusions
    Given no receipts for the selected month are excluded pending review
    When the budget summary screen renders
    Then no excluded-receipt count message is shown
