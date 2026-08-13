## Feature

Allow manual category reassignment

## Narrative

As a user
I want to fix the automatic category myself when it's wrong
So that my spending breakdown reflects reality

## Scenarios

```gherkin
Feature: Allow manual category reassignment

  Scenario: Reassign a line item's category
    Given the item "Protein Bar XL" was categorized as "Groceries"
    When the user reassigns it to "Health"
    Then the agent should update the category for that item to "Health"

  Scenario: Reassigned category persists across a subsequent view
    Given the user has reassigned the item "Protein Bar XL" from "Groceries" to "Health"
    When the user views that item again in a later, separate request
    Then the item should still show "Health" as its category
```

## Traceability

Verifies [[prob-1/concept-1/req-6]].
