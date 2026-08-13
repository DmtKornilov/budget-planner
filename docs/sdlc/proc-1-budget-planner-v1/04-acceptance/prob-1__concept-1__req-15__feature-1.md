## Feature

Detect same-position items across photos of one receipt.

## Narrative

As a user who photographs one long receipt in two overlapping shots, I want an item that appears in both photos counted once, not twice.

## Scenarios

```gherkin
Feature: Detect same-position items across photos of one receipt

  Scenario: Identify identical position split across two photos of the same long receipt
    Given the user photographs a long receipt in two overlapping shots because it does not fit in one frame
    And the item "Bananas 1kg" priced at 3.20 PLN, quantity 1, appears near the bottom of photo one
    And the same item "Bananas 1kg" priced at 3.20 PLN, quantity 1, also appears near the top of photo two
    When the agent compares the line items from both photos
    Then the pair should be classified as "same position"

  Scenario Outline: A single mismatched field results in a different position
    Given a position on photo one with name "<name1>", unit price <price1>, quantity <qty1>, total <total1>
    And a position on photo two with name "<name2>", unit price <price2>, quantity <qty2>, total <total2>
    When the agent compares the two positions
    Then the agent should classify the pair as "different position"

    Examples:
      | name1        | price1 | qty1 | total1 | name2        | price2 | qty2 | total2 |
      | Milk 2% 1L   | 4.50   | 1    | 4.50   | Milk 2.5% 1L | 4.50   | 1    | 4.50   |
      | Milk 2% 1L   | 4.50   | 1    | 4.50   | Milk 2% 1L   | 4.60   | 1    | 4.60   |
      | Milk 2% 1L   | 4.50   | 1    | 4.50   | Milk 2% 1L   | 4.50   | 2    | 9.00   |
      | Milk 2% 1L   | 4.50   | 1    | 4.50   | Milk 2% 1L   | 4.50   | 1    | 4.75   |

  Scenario: Recurring purchase across different receipts is not treated as same position
    Given the user has a receipt dated July 1, 2026 containing "Milk 2% 1L" priced at 4.50 PLN
    And a separate receipt dated July 8, 2026 containing "Milk 2% 1L" priced at 4.50 PLN
    When the agent compares positions across these two distinct receipts
    Then the agent should not classify the pair as "same position"
    And the agent should treat them as two independent purchases
```

## Traceability

- [[prob-1/concept-1/req-15]] — the requirement these scenarios verify
