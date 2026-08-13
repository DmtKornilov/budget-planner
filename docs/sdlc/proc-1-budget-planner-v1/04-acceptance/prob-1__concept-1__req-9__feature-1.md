## Feature

Route low-confidence categorization to Uncategorized.

## Narrative

As a user, I don't want the system to guess-and-hide a category it isn't sure about; I want it flagged so I can confirm or correct it.

## Scenarios

```gherkin
Feature: Route low-confidence categorization to Uncategorized

  Scenario: Fallback to Uncategorized for unrecognized item
    Given a parsed receipt contains an item with an ambiguous or unknown name
    When the agent attempts to categorize it
    And the categorization confidence is below the acceptable threshold
    Then the item should be assigned to "Uncategorized"
    And flagged for user review
```

## Traceability

- [[prob-1/concept-1/req-9]] — the requirement these scenarios verify
