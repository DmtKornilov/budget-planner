## Feature

Flag low-confidence extracted fields.

## Narrative

As a user, if the system isn't sure it read a field correctly, I want it to say so rather than silently accepting a guess, so bad OCR data doesn't quietly corrupt my budget.

## Scenarios

```gherkin
Feature: Flag low-confidence extracted fields

  Scenario: Flag a single low-confidence field
    Given the user submits a blurry receipt photo
    When the agent parses the photo
    And the confidence score for the total amount is below the acceptable threshold
    Then the agent should mark the total amount field as "low confidence"

  Scenario: Flag multiple low-confidence fields independently
    Given the user submits a receipt photo where both the merchant name and the total amount are hard to read
    When the agent parses the photo
    And the confidence scores for both fields are below the acceptable threshold
    Then the agent should mark the merchant name field as "low confidence"
    And the agent should mark the total amount field as "low confidence"
```

## Traceability

- [[prob-1/concept-1/req-4]] — the requirement these scenarios verify
