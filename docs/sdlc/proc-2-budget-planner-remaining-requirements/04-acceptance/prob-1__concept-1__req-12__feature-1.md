## Feature

Report comparison-not-possible on parse failure

## Narrative

As a user
I want to be told the comparison couldn't happen when one of my photos can't be read
So that I get a clear, honest result instead of a silent or guessed comparison

## Scenarios

```gherkin
Feature: Report comparison-not-possible on parse failure

  Scenario: Both photos parse successfully and comparison proceeds
    Given both of the two uploaded photos parse successfully
    When the user requests a same-position comparison
    Then the agent should return a normal comparison result
    And the agent should not return "comparison not possible"

  Scenario: One of two photos fails to parse
    Given one of the two uploaded photos fails to parse
    When the user requests a same-position comparison
    Then the agent should return "comparison not possible"
    And the agent should state the reason as a parsing failure

  Scenario: Both photos fail to parse
    Given both of the two uploaded photos fail to parse
    When the user requests a same-position comparison
    Then the agent should return "comparison not possible"
    And the agent should state the reason as a parsing failure
```

## Traceability

Verifies [[prob-1/concept-1/req-12]].
