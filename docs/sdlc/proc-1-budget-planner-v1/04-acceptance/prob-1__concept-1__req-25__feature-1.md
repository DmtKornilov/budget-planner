## Feature

Report excluded-receipt count in monthly summary.

## Narrative

As a user, if my total doesn't include everything, I want to know how many receipts are pending, so I don't mistake an incomplete number for a final one.

## Scenarios

```gherkin
Feature: Report excluded-receipt count in monthly summary

  Scenario: Report the count when receipts are excluded
    Given the user has 10 valid receipts and 2 receipts flagged "requires manual review" in July 2026
    When the agent calculates the July 2026 budget
    Then the summary should note that 2 receipts were excluded pending review

  Scenario: No exclusion note when nothing is excluded
    Given the user has 5 valid receipts in July 2026 and none flagged for review
    When the agent calculates the July 2026 budget
    Then the summary should not report any excluded receipts
```

## Traceability

- [[prob-1/concept-1/req-25]] — the requirement these scenarios verify
