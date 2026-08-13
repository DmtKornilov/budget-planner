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
