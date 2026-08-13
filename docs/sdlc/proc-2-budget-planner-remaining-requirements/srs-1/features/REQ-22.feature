Feature: Encrypt receipt data at rest

  Scenario: Receipt images are encrypted at rest
    Given a receipt photo has been uploaded and stored
    When the underlying image storage is inspected
    Then the stored image should be encrypted at rest

  Scenario: Extracted receipt data is encrypted at rest
    Given a receipt has been parsed and its data persisted
    When the underlying database storage is inspected
    Then the stored receipt and line-item data should be encrypted at rest

  Scenario: Updated receipt data remains encrypted at rest
    Given a receipt's category has already been stored and encrypted at rest
    When the user corrects the category and the record is updated
    And the underlying database storage is inspected after the update
    Then the updated receipt data should still be encrypted at rest
