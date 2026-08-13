## Feature

Learn from manual category corrections.

## Narrative

As a user, I don't want to correct the same recurring item every time it shows up again from the same store, so a correction should stick for that merchant.

## Scenarios

```gherkin
Feature: Learn from manual category corrections

  Scenario: Correction applies to a later receipt from the same merchant
    Given the item "Protein Bar XL" was categorized as "Groceries" on a receipt from "FitMart"
    And the user reassigns it to "Health"
    When a new receipt from "FitMart" containing "Protein Bar XL" is parsed
    Then "Protein Bar XL" should be automatically categorized as "Health"

  Scenario: Correction does not apply to the same item name from a different merchant
    Given the item "Protein Bar XL" was categorized as "Groceries" on a receipt from "FitMart"
    And the user reassigns it to "Health"
    When a new receipt from "Corner Store" containing "Protein Bar XL" is parsed
    Then "Protein Bar XL" from "Corner Store" should not be automatically forced to "Health"
```

## Traceability

- [[prob-1/concept-1/req-11]] — the requirement these scenarios verify
