# Budget Planner — Requirements Baseline

## Purpose

This document is the committed requirements baseline for the Budget Planner (AI Budget Agent) MVP. It assembles the approved outputs of the problem, concept, requirements, and acceptance stages of the Meridian SDLC process (proc-1) into one document that design and implementation are built against, and that someone outside this process can read on its own. Every requirement, quality attribute, and scenario below is copied verbatim from its approved source artifact — nothing here is a paraphrase.

## Scope

**In scope for this baseline (from [[prob-1]] and [[prob-1/concept-1]]):** receipt photo digitization (BR-1), multi-photo same-position detection (BR-2), spend categorization (BR-3), monthly budget calculation (BR-4), category statistics (BR-5), and goal-based optimization advice (BR-6), built as a full-stack JS web application (Next.js/Node/Postgres) using a hosted OCR API and an LLM API, deployed on a low-cost PaaS. Must-have priority covers BR-1, BR-3, BR-4, and cross-cutting security/failure-handling NFRs; should-have covers BR-2 and BR-5; could-have covers BR-6.

**Out of scope (carried from [[prob-1]] and [[prob-1/concept-1]]):** direct bank/card integration, multi-currency conversion, shared/household budgets, automated bill payment or any financial transaction execution, tax filing/advice, native mobile apps, self-hosted/custom-trained OCR or ML models, and multi-region/high-availability infrastructure.

## Definitions

| Term | Meaning |
|---|---|
| Configured threshold | The OCR-confidence and categorization-confidence cutoffs used by req-4 and req-9. No numeric value is defined yet — left as an open configuration decision (BRD open question 5). Behavior is specified only in relative terms: below the threshold vs. at-or-above it. |
| Configured minimum number of receipts | The insufficient-data cutoff used by req-21 and req-26 to decide whether goal-based advice can be generated. No numeric value is defined yet. |
| Supported format | JPEG, PNG, HEIC, or PDF-scan — the four file formats req-1 validates for and req-2 rejects anything outside of. |
| Requires-manual-review | The receipt status set when the total amount or transaction date cannot be extracted (req-5). A receipt in this status is excluded from budget totals (req-13) and its exclusion is counted in the monthly summary (req-25). |
| Same merchant | Used by req-11 to decide whether a category correction carries forward to a future receipt. Whether matching is exact-string or fuzzy is undecided — see Open questions. |

## Functional requirements

| Id | Priority | Verification | Statement |
|---|---|---|---|
| req-1 | must | test | When a user submits a check photo, the receipt digitization service shall validate that the file is a supported image format (JPEG, PNG, HEIC, or PDF-scan) before processing. |
| req-2 | must | test | If the submitted file is not a supported format, then the receipt digitization service shall reject the upload and return an error message specifying the accepted formats. |
| req-3 | must | test | When a valid check photo is received, the receipt digitization service shall extract the merchant name, transaction date, transaction time, line items, and total amount. |
| req-4 | must | test | If the OCR confidence for a required extracted field falls below the configured threshold, then the receipt digitization service shall flag that field as low confidence. |
| req-5 | must | test | If the receipt digitization service cannot extract a total amount or a transaction date, then the receipt digitization service shall mark the receipt as requires-manual-review and exclude it from automated budget calculations. |
| req-6 | must | test | When parsing succeeds, the receipt digitization service shall persist the extracted receipt, including header, line items, and a reference to the original image, to the database with a unique receipt identifier. |
| req-7 | must | test | When a receipt is successfully parsed, the categorization service shall assign a category to each line item from the predefined category taxonomy. |
| req-8 | must | inspection | The categorization service shall provide an Uncategorized fallback category for line items it cannot confidently classify. |
| req-9 | must | test | If the categorization confidence for a line item falls below the configured threshold, then the categorization service shall assign that item to the Uncategorized category and flag it for user review. |
| req-10 | must | test | The categorization service shall allow the user to manually reassign the category of any line item. |
| req-11 | must | test | When a user manually reassigns a line item's category, the categorization service shall store the correction and apply it to future line items with the same name from the same merchant. |
| req-12 | must | test | When the user requests a monthly budget summary, the budget calculation service shall aggregate the total amount of all categorized, non-flagged receipts within the selected calendar month using each receipt's transaction date. |
| req-13 | must | test | If a receipt is marked requires-manual-review, then the budget calculation service shall exclude it from the monthly budget total. |
| req-14 | must | test | While the current date is within an in-progress calendar month, the budget calculation service shall present the budget total as a month-to-date figure labeled as incomplete. |
| req-15 | should | test | When two check photos suspected to be of the same physical receipt are compared, the position-matching service shall classify a pair of line items as same-position only if item name, unit price, quantity, and total price all match exactly. |
| req-16 | should | test | If one or both of two compared check photos fail parsing, then the position-matching service shall return a comparison-not-possible result stating the parsing failure as the reason. |
| req-17 | should | test | The position-matching service shall allow the user to manually override an automatic same-position or different-position determination. |
| req-18 | should | test | When the user requests category statistics for a date range, the statistics service shall calculate the total spend, percentage of overall spend, and transaction count for each category, ranked from highest to lowest spend. |
| req-19 | should | test | If a requested statistics period contains no receipts, then the statistics service shall inform the user that no receipts were found for that period. |
| req-20 | could | test | The goal-advice service shall allow the user to define a financial goal or a lifestyle goal. |
| req-21 | could | test | If the user has fewer than the configured minimum number of receipts on record, then the goal-advice service shall inform the user that more historical data is needed. |
| req-22 | must | inspection | The system shall store all receipt images and extracted receipt data encrypted at rest. |
| req-23 | must | test | The system shall associate all stored receipts, line items, and statistics with a single owning user account. |
| req-24 | must | test | When a user deletes a receipt, the system shall remove it from all budget and statistics calculations within the same session. |
| req-25 | must | test | If a receipt is marked requires-manual-review, then the budget calculation service shall indicate the count of excluded receipts in the monthly budget summary. |
| req-26 | could | test | While the user has fewer than the configured minimum number of receipts on record, the goal-advice service shall withhold specific recommendations. |
| req-27 | must | test | The system shall not expose one user's stored data to another user. |
| req-28 | must | test | If the OCR API or the LLM API fails or times out, then the system shall notify the user with a message prompting them to try again. |

## Quality attributes

| Id | Priority | Metric | Threshold | Conditions |
|---|---|---|---|---|
| qa-1 | must | end-to-end parsing response time from photo submission to result | 10 seconds | for a single receipt, under normal (non-concurrent-load) conditions; no concurrent-user volume target is defined |

## Acceptance scenarios

Each requirement's Gherkin scenarios are lifted verbatim into `features/req-N.feature`. See the traceability matrix below for the mapping. qa-1 has no feature file: the acceptance stage's branches fan out only over requirement-type artifacts, not quality attributes — its 10-second threshold will need a corresponding test case defined at the build stage.

## Traceability matrix

See `traceability-matrix.md`.

## Open questions and assumptions

- **No validating evidence yet for the underlying problem** ([[prob-1]] Evidence): this build proceeds as a hypothesis-driven bet, not a validated-need build.
- **Confidence thresholds undefined**: OCR-confidence (req-4), categorization-confidence (req-9), and minimum-receipts-for-advice (req-21, req-26) are all left as configuration values with no number chosen yet — explicitly deferred by the user's `thresholds` answer rather than invented.
- **Six BRD open questions carried forward unresolved** (from [[prob-1]] Open questions): target values for success metrics; whether multi-currency is truly out of scope; whether household/shared budgets belong in a future phase; tolerance for advice generated from limited data; the actual confidence threshold values; whether budget periods must be strict calendar months or should support custom cycles.
- **"Same item name" matching strategy undecided** (req-11): exact-string vs. fuzzy matching for carrying a category correction forward to future receipts from the same merchant was flagged during acceptance analysis and left undecided rather than guessed.
- **Multiple/replacement goals undecided** (req-20): whether a user can hold more than one goal at once, or what happens when a new goal is defined while one exists, was flagged during acceptance analysis and left undecided rather than guessed.
- **qa-1's threshold (10 seconds) is confirmed, not proposed**: it was directly given by the user (via the BRD's N4 target), not invented during this process.
