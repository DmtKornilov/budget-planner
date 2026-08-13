Feature: Associate all data with a single owning user account

  Scenario: A stored receipt carries the submitting user's account id
    Given the user is logged in
    When the user submits and successfully parses a receipt
    Then the stored receipt record should carry that user's account id

  Scenario: Derived statistics carry the same ownership
    Given a user has categorized receipts on record
    When the user requests category statistics
    Then the returned statistics should be scoped to that user's account id

  Scenario: Statistics for one user are isolated from another user's data
    Given user A has categorized receipts on record
    And user B has different categorized receipts on record
    When user A requests category statistics
    Then the returned statistics should reflect only user A's receipts
    And the returned statistics should not include any of user B's data
