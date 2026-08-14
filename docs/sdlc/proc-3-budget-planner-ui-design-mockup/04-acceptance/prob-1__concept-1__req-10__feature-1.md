## Feature

Shared page shell

## Narrative

As the person who uses Budget Planner
I want every screen to share the same page wrapper and heading/navigation treatment
So that moving between screens feels like using one app, not four disconnected pages

## Scenarios

```gherkin
Feature: Shared page shell

  Scenario: A routed screen renders inside the shared shell
    Given the root layout defines a shared page wrapper and heading/navigation treatment
    When the home screen renders
    Then the home screen appears inside the shared page wrapper
    And the home screen shows the shared heading/navigation treatment

  Scenario: Two different routed screens show the same shell
    Given the root layout defines a shared page wrapper and heading/navigation treatment
    When the receipts list screen and the budget summary screen both render
    Then both screens appear inside the same shared page wrapper
    And both screens show the same heading/navigation treatment

  Scenario: The category editor inherits its parent screen's shell
    Given the line-item category editor is rendered as part of the receipts list screen
    When the receipts list screen renders inside the shared shell
    Then the category editor appears within that same shared shell
    And the category editor does not render its own separate page shell

  Scenario: A screen with its own inconsistent chrome fails the check
    Given a screen renders a heading outside the shared page wrapper
    When the screen is reviewed against the shared page shell
    Then the screen is flagged as not using the shared shell
```

## Traceability

Verifies [[prob-1/concept-1/req-10]].
