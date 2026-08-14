Feature: Style line-item category editor

  Scenario: The category selector is styled in its normal state
    Given the shared design tokens are defined
    When a line item's category selector renders in its enabled state
    Then the selector uses the shared design tokens

  Scenario: The category selector is visibly different while saving
    Given a category change has been submitted and is pending
    When the category selector renders in its disabled/pending state
    Then the selector's disabled appearance is visually distinguished from its enabled appearance
    And the disabled appearance uses the shared design tokens
