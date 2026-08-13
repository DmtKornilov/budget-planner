## Feature

Surface a generic error on OCR/LLM API failure.

## Narrative

As a user, if the parsing or categorization service itself is down, I want a clear "try again" message rather than a silent failure or a confusing error.

## Scenarios

```gherkin
Feature: Surface a generic error on OCR/LLM API failure

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

- [[prob-1/concept-1/req-28]] — the requirement these scenarios verify
