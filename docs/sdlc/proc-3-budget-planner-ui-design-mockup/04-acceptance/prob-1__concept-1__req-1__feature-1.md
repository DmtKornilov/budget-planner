## Feature

Shared design tokens

## Narrative

As the person who uses Budget Planner
I want the four screens to draw their colors, type sizes, and spacing from one shared source
So that the app reads as one cohesive product instead of four independently styled pages

## Scenarios

```gherkin
Feature: Shared design tokens

  Scenario: A screen uses the shared design tokens
    Given the shared stylesheet defines a heading color token
    When the home screen renders its heading
    Then the heading uses the shared heading color token

  Scenario: Two different screens share the same token values
    Given the shared stylesheet defines a heading color token and a body spacing token
    When the home screen and the budget summary screen both render
    Then both screens use the same heading color token
    And both screens use the same body spacing token

  Scenario: A screen with a hardcoded value instead of a token fails the check
    Given a screen defines its own color value instead of referencing a shared token
    When the screen is reviewed against the shared design tokens
    Then the hardcoded value is flagged as not using the shared tokens
```

## Traceability

Verifies [[prob-1/concept-1/req-1]].
