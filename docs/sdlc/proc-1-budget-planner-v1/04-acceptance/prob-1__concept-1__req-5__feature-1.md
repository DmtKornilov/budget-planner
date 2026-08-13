## Feature

Route unparseable receipts to manual review.

## Narrative

As a user, if the system can't tell how much I spent or when, I want that receipt kept out of my budget totals until it's resolved, so my numbers stay trustworthy.

## Scenarios

```gherkin
Feature: Route unparseable receipts to manual review

  Scenario: Missing total amount triggers manual review
    Given the user submits a photo where the total amount is not visible
    When the agent attempts to parse the photo
    Then the agent should mark the receipt as "requires manual review"
    And the receipt should be excluded from automatic budget calculations

  Scenario: Missing transaction date triggers manual review
    Given the user submits a photo where the transaction date is not visible
    When the agent attempts to parse the photo
    Then the agent should mark the receipt as "requires manual review"
    And the receipt should be excluded from automatic budget calculations
```

## Traceability

- [[prob-1/concept-1/req-5]] — the requirement these scenarios verify
