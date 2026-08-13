Feature: Encrypt receipt data at rest

  Scenario: Receipt images are encrypted at rest
    Given a receipt photo has been uploaded and stored
    When the underlying image storage is inspected
    Then the stored image should be encrypted at rest

  Scenario: Extracted receipt data is encrypted at rest
    Given a receipt has been parsed and its data persisted
    When the underlying database storage is inspected
    Then the stored receipt and line-item data should be encrypted at rest
