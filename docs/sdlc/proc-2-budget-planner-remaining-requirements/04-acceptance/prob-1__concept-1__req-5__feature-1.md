## Feature

Route low-confidence categorization to Uncategorized

## Narrative

As a user
I don't want the system to guess-and-hide a category it isn't sure about
So that low-confidence items are flagged and I can confirm or correct them

## Scenarios

```gherkin
Feature: Route low-confidence categorization to Uncategorized

  Scenario: High-confidence categorization assigns the real category without flagging
    Given a parsed receipt contains a clearly recognizable item
    When the agent categorizes it and the categorization confidence is above the acceptable threshold
    Then the item should be assigned to its matching category
    And the item should not be flagged for review

  Scenario: Confidence exactly at the threshold is treated as acceptable
    Given a parsed receipt contains an item whose categorization confidence exactly equals the configured threshold
    When the agent attempts to categorize it
    Then the item should be assigned to its matching category
    And the item should not be flagged for review

  Scenario: Fallback to Uncategorized for unrecognized item
    Given a parsed receipt contains an item with an ambiguous or unknown name
    When the agent attempts to categorize it
    And the categorization confidence is below the acceptable threshold
    Then the item should be assigned to "Uncategorized"
    And flagged for user review
```

## Traceability

Verifies [[prob-1/concept-1/req-5]].
