## Feature

Style category-save error state

## Narrative

As the person who uses Budget Planner
I want a failed category save to show a clearly designed error message
So that I notice it and understand what happened instead of it looking broken

## Scenarios

```gherkin
Feature: Style category-save error state

  Scenario: A failed category save shows a styled error message
    Given the shared design tokens are defined
    When a line-item category change fails to save
    Then the "Could not save the category change. Please try again." message uses the shared design tokens

  Scenario: A successful save shows no error message
    Given a line-item category change is submitted
    When the save succeeds
    Then no error message is shown

  Scenario: A repeated failure shows the styled error again, not duplicated
    Given a line-item category change has already failed once and shown the styled error
    When the person retries and the save fails again
    Then the styled error message is shown once, not duplicated
```

## Traceability

Verifies [[prob-1/concept-1/req-8]].
