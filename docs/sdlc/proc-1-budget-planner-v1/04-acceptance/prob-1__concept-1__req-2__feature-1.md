## Feature

Reject unsupported receipt file formats.

## Narrative

As a user, if I accidentally submit a file the system cannot process as a receipt photo, I want a clear rejection with guidance on what formats are accepted, so I know how to fix it.

## Scenarios

```gherkin
Feature: Reject unsupported file formats

  Scenario: Reject a clearly unsupported format
    Given the user is logged in
    When the user submits a ".docx" file instead of a photo
    Then the agent should reject the upload
    And the agent should return an error stating supported formats are JPEG, PNG, HEIC, and PDF-scan

  Scenario: Reject a file with no recognizable format
    Given the user is logged in
    When the user submits a file with no extension and unrecognizable content
    Then the agent should reject the upload
    And the agent should return an error stating supported formats are JPEG, PNG, HEIC, and PDF-scan
```

## Traceability

- [[prob-1/concept-1/req-2]] — the requirement these scenarios verify
