## Feature

Persist parsed receipts.

## Narrative

As a user, once my receipt is parsed, I want it saved so I can see it later and have it count toward my budget.

## Scenarios

```gherkin
Feature: Persist parsed receipts

  Scenario: Successfully parse and store a valid receipt photo
    Given the user is logged in
    And the user has a clear JPEG photo of a grocery store receipt
    When the user submits the photo to the agent
    Then the agent should store the parsed receipt in the database with a unique receipt identifier
    And the agent should link the original photo to the stored record

  Scenario: Persist a receipt as a distinct record even when it recurs
    Given a receipt from "Fresh Market" dated 2026-07-20 for 84.50 PLN already exists in the database
    When the user uploads another receipt with the same merchant, date, and total
    Then the newly parsed receipt should be assigned its own unique receipt identifier
```

## Traceability

- [[prob-1/concept-1/req-6]] — the requirement these scenarios verify
