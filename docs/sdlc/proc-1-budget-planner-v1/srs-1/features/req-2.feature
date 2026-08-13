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
