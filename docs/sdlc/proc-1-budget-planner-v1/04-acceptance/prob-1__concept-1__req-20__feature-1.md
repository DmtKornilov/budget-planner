## Feature

Allow the user to define a financial or lifestyle goal.

## Narrative

As a user, I want to state what I'm trying to achieve — a savings target or a lifestyle change — so the system's advice can be tied to something I actually care about.

## Scenarios

```gherkin
Feature: Allow the user to define a financial or lifestyle goal

  Scenario: Define a financial goal
    Given the user is logged in
    When the user sets a goal to save 500 PLN this month
    Then the goal should be stored against the user's account

  Scenario: Define a lifestyle goal
    Given the user is logged in
    When the user sets a goal to lose weight
    Then the goal should be stored against the user's account
```

## Traceability

- [[prob-1/concept-1/req-20]] — the requirement these scenarios verify
