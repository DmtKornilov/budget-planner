## Feature

Prevent cross-user data exposure.

## Narrative

As a user, my receipts and budget are private, so another user's account should never be able to see or reach them, whether by browsing or by directly guessing an id.

## Scenarios

```gherkin
Feature: Prevent cross-user data exposure

  Scenario: A user's receipt list never includes another user's receipts
    Given user A and user B each have their own receipts
    When user A requests their receipt list
    Then the response should contain only user A's receipts

  Scenario: Direct access to another user's receipt is denied
    Given user A and user B each have their own receipts
    When user A attempts to directly access one of user B's receipt records by id
    Then the request should be denied
```

## Traceability

- [[prob-1/concept-1/req-27]] — the requirement these scenarios verify
