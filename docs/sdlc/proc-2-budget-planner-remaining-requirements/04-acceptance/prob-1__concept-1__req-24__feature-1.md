## Feature

Surface a generic error on OCR/LLM API failure

## Narrative

As a user
I want a clear "try again" message rather than a silent failure or a confusing error
So that I know what to do when the parsing or categorization service itself is down

## Scenarios

```gherkin
Feature: Surface a generic error on OCR/LLM API failure

  Scenario: Successful OCR and LLM calls produce a normal result
    Given the user submits a receipt photo
    And both the OCR API and the LLM API respond successfully
    When the user views the result
    Then the receipt should be parsed and categorized normally
    And no try-again message should be shown

  Scenario: OCR API failure surfaces a generic error
    Given the OCR API times out while parsing a submitted receipt photo
    When the user views the result
    Then the user should see a message prompting them to try again
    And no automatic retry should occur

  Scenario: LLM API failure surfaces a generic error
    Given the LLM API times out while categorizing a parsed receipt
    When the user views the result
    Then the user should see a message prompting them to try again
    And no automatic retry should occur
```

## Traceability

Verifies [[prob-1/concept-1/req-24]].
