## Feature

Report comparison-not-possible on parse failure.

## Narrative

As a user, if one of my photos can't be read, I want to be told the comparison couldn't happen, rather than getting a silent or guessed result.

## Scenarios

```gherkin
Feature: Report comparison-not-possible on parse failure

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

- [[prob-1/concept-1/req-16]] — the requirement these scenarios verify
