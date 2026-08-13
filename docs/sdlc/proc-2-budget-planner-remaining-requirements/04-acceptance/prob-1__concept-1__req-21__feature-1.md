## Feature

Report excluded-receipt count in monthly summary

## Narrative

As a user
I want to know how many receipts are pending review when my total doesn't include everything
So that I don't mistake an incomplete number for a final one

## Scenarios

```gherkin
Feature: Report excluded-receipt count in monthly summary

  Scenario: No exclusion note when nothing is excluded
    Given the user has 5 valid receipts in July 2026 and none flagged for review
    When the agent calculates the July 2026 budget
    Then the summary should not report any excluded receipts

  Scenario: Report the count when exactly one receipt is excluded
    Given the user has 5 valid receipts and 1 receipt flagged "requires manual review" in July 2026
    When the agent calculates the July 2026 budget
    Then the summary should note that 1 receipt was excluded pending review

  Scenario: Report the count when receipts are excluded
    Given the user has 10 valid receipts and 2 receipts flagged "requires manual review" in July 2026
    When the agent calculates the July 2026 budget
    Then the summary should note that 2 receipts were excluded pending review
```

## Traceability

Verifies [[prob-1/concept-1/req-21]].
