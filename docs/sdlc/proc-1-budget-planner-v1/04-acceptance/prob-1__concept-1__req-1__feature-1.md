## Feature

Receipt photo format validation.

## Narrative

As a user submitting a receipt photo, I want the system to check the file format before processing, so that only supported image types are ever handed to the parsing pipeline.

## Scenarios

```gherkin
Feature: Validate uploaded file format

  Scenario Outline: Accept each supported format
    Given the user has a receipt photo in "<format>" format
    When the user submits the photo
    Then the receipt digitization service validates the format as supported
    And the photo proceeds to processing

    Examples:
      | format   |
      | JPEG     |
      | PNG      |
      | HEIC     |
      | PDF-scan |
```

## Traceability

- [[prob-1/concept-1/req-1]] — the requirement these scenarios verify
