Feature: Associate all data with a single owning user account

  Scenario: A stored receipt carries the submitting user's account id
    Given the user is logged in
    When the user submits and successfully parses a receipt
    Then the stored receipt record should carry that user's account id

  Scenario: Derived statistics carry the same ownership
    Given a user has categorized receipts on record
    When the user requests category statistics
    Then the returned statistics should be scoped to that user's account id
