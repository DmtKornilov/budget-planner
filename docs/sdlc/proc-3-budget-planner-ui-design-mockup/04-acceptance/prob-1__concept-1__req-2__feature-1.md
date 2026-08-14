## Feature

Style home screen

## Narrative

As the person who uses Budget Planner
I want the home screen's heading, description, and navigation to look designed
So that opening the app doesn't feel like landing on an unfinished page

## Scenarios

```gherkin
Feature: Style home screen

  Scenario: The home screen's heading and description are styled
    Given the shared design tokens are defined
    When the home screen renders
    Then the heading uses the shared design tokens
    And the description text uses the shared design tokens

  Scenario: The home screen's navigation links are styled
    Given the shared design tokens are defined
    When the home screen renders
    Then both the "Receipts" and "Monthly Budget Summary" navigation links use the shared design tokens

  Scenario: Partial styling is flagged
    Given the home screen's heading and description use the shared design tokens
    When the navigation links are reviewed
    Then any navigation link not using the shared design tokens is flagged as incomplete
```

## Traceability

Verifies [[prob-1/concept-1/req-2]].
