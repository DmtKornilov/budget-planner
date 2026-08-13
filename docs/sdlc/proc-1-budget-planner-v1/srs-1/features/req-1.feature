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
