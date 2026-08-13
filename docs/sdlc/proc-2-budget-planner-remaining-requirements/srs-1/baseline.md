# Budget Planner — Remaining Requirements Baseline

## Purpose

This document is the committed requirements baseline for the Budget Planner's remaining scope (Meridian SDLC process proc-2). It assembles the approved outputs of the problem, concept, requirements, and acceptance stages of this process into one document that design and implementation are built against, and that someone outside this process can read on its own. Every requirement, quality attribute, and scenario below is copied verbatim from its approved source artifact — nothing here is a paraphrase. This process builds directly on top of what proc-1 already delivered and baselined (`docs/sdlc/proc-1-budget-planner-v1/srs-1/baseline.md`): receipt format validation/rejection and structured extraction (proc-1's REQ-1, REQ-2, REQ-3, REQ-6) are not restated here — they are an approved, already-shipped input this baseline builds on, not part of this baseline's own scope.

## Scope

**In scope for this baseline** (from [[prob-1]] and [[prob-1/concept-1]]): the six remaining service areas identified in the concept — confidence flagging and manual-review routing for digitized receipts (REQ-4, REQ-5), spend categorization (REQ-7 through REQ-11), monthly budget calculation (REQ-12 through REQ-14, REQ-24, REQ-25), multi-photo same-position matching (REQ-15 through REQ-17), category statistics (REQ-18, REQ-19), goal-based optimization advice (REQ-20, REQ-21, REQ-26), cross-cutting security and failure-handling requirements (REQ-22, REQ-23, REQ-27, REQ-28), and two working UI screens added to this process's scope (REQ-29, REQ-30) — built by extending the existing `lib/` sibling-module pattern established by proc-1, with mock/in-memory implementations behind stable interfaces rather than real Postgres, real auth, or a real OCR/LLM API integration. Must-have priority covers REQ-4, REQ-5, REQ-7 through REQ-14, REQ-22 through REQ-25, REQ-27 through REQ-30, and the quality attribute BP-NFR-1; should-have covers REQ-15 through REQ-19; could-have covers REQ-20, REQ-21, and REQ-26.

**Out of scope** (carried from [[prob-1]] and [[prob-1/concept-1]]): direct bank/card integration, multi-currency conversion, shared/household budgets, automated bill payment or any financial transaction execution, tax filing/advice, and any layered architectural refactor of the existing codebase. Also out of scope for this specific process: proc-1's already-delivered requirements (receipt format validation, structured extraction, receipt persistence) are not being redone or re-litigated. Real Postgres persistence, a real auth provider, and real OCR/LLM API integration are explicitly deferred past this process — the security requirements (REQ-22, REQ-23, REQ-27) are implemented as correctly-shaped logic against a placeholder auth/no-real-encryption foundation, not production infrastructure (see Open questions and assumptions).

## Definitions

| Term | Meaning |
|---|---|
| Configured threshold | The OCR-confidence (REQ-4) and categorization-confidence (REQ-9) cutoffs. No numeric value is defined yet — left as an open configuration decision, consistent with [[prob-1]]'s Open questions. Behavior is specified only in relative terms: below the threshold vs. at-or-above it. |
| Configured minimum number of receipts | The insufficient-data cutoff used by REQ-21 and REQ-26 to decide whether goal-based advice can be generated. No numeric value is defined yet. |
| Requires-manual-review | The receipt status set when the total amount or transaction date cannot be extracted (REQ-5). A receipt in this status is excluded from budget totals (REQ-13) and its exclusion is counted in the monthly summary (REQ-25). |
| Same name from the same merchant | Used by REQ-11 to decide whether a category correction carries forward to a future receipt. Whether matching is exact-string or fuzzy is undecided — see Open questions and assumptions. |
| Predefined category taxonomy | The fixed set of categories (e.g. Groceries, Transport, Dining, Health, Uncategorized) that REQ-7 assigns from and REQ-8 provides a fallback within. Its actual contents are not defined in this process's artifacts; assumed to be a business/configuration input. |
| Financial goal / lifestyle goal | The two goal types REQ-20 allows a user to define (e.g. a savings target vs. a behavior change like losing weight). Neither term is formally defined or distinguished beyond example; what makes a goal "financial" versus "lifestyle" is left to the reader's assumption. |
| Categorized, non-flagged receipts | The set REQ-12 aggregates into a monthly total. Whether "categorized" requires every line item to have a non-Uncategorized category, or merely at least one, is not resolved by any requirement's text. |

## Functional requirements

| Id | Priority | Verification | Statement |
|---|---|---|---|
| REQ-4 | must | test | If the OCR confidence for a required extracted field falls below the configured threshold, then the receipt digitization service shall flag that field as low confidence. |
| REQ-5 | must | test | If the receipt digitization service cannot extract a total amount or a transaction date, then the receipt digitization service shall mark the receipt as requires-manual-review and exclude it from automated budget calculations. |
| REQ-7 | must | test | When a receipt is successfully parsed, the categorization service shall assign a category to each line item from the predefined category taxonomy. |
| REQ-8 | must | inspection | The categorization service shall provide an Uncategorized fallback category for line items it cannot confidently classify. |
| REQ-9 | must | test | If the categorization confidence for a line item falls below the configured threshold, then the categorization service shall assign that item to the Uncategorized category and flag it for user review. |
| REQ-10 | must | test | The categorization service shall allow the user to manually reassign the category of any line item. |
| REQ-11 | must | test | When a user manually reassigns a line item's category, the categorization service shall store the correction and apply it to future line items with the same name from the same merchant. |
| REQ-12 | must | test | When the user requests a monthly budget summary, the budget calculation service shall aggregate the total amount of all categorized, non-flagged receipts within the selected calendar month using each receipt's transaction date. |
| REQ-13 | must | test | If a receipt is marked requires-manual-review, then the budget calculation service shall exclude it from the monthly budget total. |
| REQ-14 | must | test | While the current date is within an in-progress calendar month, the budget calculation service shall present the budget total as a month-to-date figure labeled as incomplete. |
| REQ-15 | should | test | When two check photos suspected to be of the same physical receipt are compared, the position-matching service shall classify a pair of line items as same-position only if item name, unit price, quantity, and total price all match exactly. |
| REQ-16 | should | test | If one or both of two compared check photos fail parsing, then the position-matching service shall return a comparison-not-possible result stating the parsing failure as the reason. |
| REQ-17 | should | test | The position-matching service shall allow the user to manually override an automatic same-position or different-position determination. |
| REQ-18 | should | test | When the user requests category statistics for a date range, the statistics service shall calculate the total spend, percentage of overall spend, and transaction count for each category, ranked from highest to lowest spend. |
| REQ-19 | should | test | If a requested statistics period contains no receipts, then the statistics service shall inform the user that no receipts were found for that period. |
| REQ-20 | could | test | The goal-advice service shall allow the user to define a financial goal or a lifestyle goal. |
| REQ-21 | could | test | If the user has fewer than the configured minimum number of receipts on record, then the goal-advice service shall inform the user that more historical data is needed. |
| REQ-22 | must | inspection | The system shall store all receipt images and extracted receipt data encrypted at rest. |
| REQ-23 | must | test | The system shall associate all stored receipts, line items, and statistics with a single owning user account. |
| REQ-24 | must | test | When a user deletes a receipt, the system shall remove it from all budget and statistics calculations within the same session. |
| REQ-25 | must | test | If a receipt is marked requires-manual-review, then the budget calculation service shall indicate the count of excluded receipts in the monthly budget summary. |
| REQ-26 | could | test | While the user has fewer than the configured minimum number of receipts on record, the goal-advice service shall withhold specific recommendations. |
| REQ-27 | must | test | The system shall not expose one user's stored data to another user. |
| REQ-28 | must | test | If the OCR API or the LLM API fails or times out, then the system shall notify the user with a message prompting them to try again. |
| REQ-29 | must | test | The system shall provide a receipt list screen that displays each digitized receipt's line items with their assigned category and allows the user to manually reassign a line item's category from that screen. |
| REQ-30 | must | test | The system shall provide a monthly budget summary screen that displays the month-to-date total labeled as incomplete while the month is in progress and displays the count of receipts excluded as requires-manual-review. |

## Quality attributes

| Id | Priority | Metric | Threshold | Conditions |
|---|---|---|---|---|
| BP-NFR-1 | must | end-to-end parsing response time from photo submission to result | 10 seconds | for a single receipt, under normal (non-concurrent-load) conditions; no concurrent-user volume target is defined |

## Acceptance scenarios

Each requirement's Gherkin scenarios are lifted verbatim into `features/REQ-N.feature`. See the traceability matrix below for the mapping and per-requirement scenario counts. BP-NFR-1 has no feature file: the acceptance stage's branches fan out only over requirement-type artifacts, not quality attributes — its 10-second threshold will need a corresponding test case defined at the build stage. This is the same structural limitation proc-1's own baseline documented for its qa-1.

## Traceability matrix

See `traceability-matrix.md`.

## Open questions and assumptions

- **Proposed vs. confirmed thresholds**: the only quality-attribute threshold in this baseline (BP-NFR-1, 10-second parsing response time) is a number the user directly confirmed (the BRD's N4 target), not one proposed during this process. No other numeric threshold was proposed: OCR-confidence (REQ-4), categorization-confidence (REQ-9), and minimum-receipts-for-advice (REQ-21, REQ-26) were all deliberately left without an invented number, recorded as open configuration values instead.
- **Uncovered requirements**: none. All 26 approved requirements in this process have exactly one acceptance scenario (`feature-1`). The only approved artifact with no acceptance scenario is the quality attribute BP-NFR-1 (qa-1) — this is expected, inherited template behavior (the acceptance stage only fans out over requirement-type artifacts), the same limitation proc-1's own baseline documented for its equivalent qa-1.
- **Confidence thresholds undefined**: OCR-confidence (REQ-4), categorization-confidence (REQ-9), and minimum-receipts-for-advice (REQ-21, REQ-26) are all left as configuration values with no number chosen yet — explicitly deferred rather than invented, per the confirmed `thresholds` answer from the requirements stage.
- **"Requires-manual-review" definition is inherited, not restated**: the status's meaning (set when the total amount or transaction date cannot be extracted; excludes the receipt from budget totals) is established by REQ-5 itself; later requirements (REQ-13, REQ-24, REQ-25) rely on that definition rather than redefining it — captured explicitly under Definitions above so a reader doesn't have to reconstruct it.
- **"Same name from the same merchant" matching strategy undecided** (REQ-11): exact-string vs. fuzzy matching for carrying a category correction forward to future receipts from the same merchant was flagged during acceptance analysis and left undecided — carried forward from proc-1's own identical open question, still unresolved.
- **Category taxonomy contents undefined** (REQ-7, REQ-8): the predefined category taxonomy's actual contents (which categories exist, beyond Uncategorized and the examples used in scenarios) are not defined anywhere in this process's artifacts; assumed to be supplied as a business/configuration input, consistent with [[prob-1]]'s carried-forward assumption.
- **"Financial goal" vs. "lifestyle goal" undistinguished** (REQ-20): both terms are used but neither is formally defined; what makes a goal "financial" versus "lifestyle" is left to the reader's assumption.
- **"Categorized, non-flagged receipts" ambiguous** (REQ-12): whether a receipt qualifies once at least one line item has a category, or only once every line item does (including items correctly routed to Uncategorized), is not resolved by any requirement's text.
- **Multiple/replacement goals undecided** (REQ-20): whether a user can hold more than one goal at once, or what happens when a new goal is defined while one exists, was flagged during requirements analysis and left undecided — same unresolved status as proc-1 left it.
- **Placeholder security implementation, stated plainly**: per [[prob-1/concept-1]]'s Chosen approach and Risks, the security requirements (REQ-22 encryption at rest, REQ-23 and REQ-27 per-user isolation) are implemented as correctly-shaped logic against a placeholder auth/no-real-encryption foundation, not real infrastructure. A reader of this baseline should not mistake "encrypted at rest" or "per-user isolation" for production-grade guarantees until real infrastructure replaces the placeholders.
- **Six BRD open questions carried forward unresolved** (from [[prob-1]] Open questions): (1) target values for the BRD's success metrics; (2) whether multi-currency is truly out of scope; (3) whether household/shared budgets belong in a future phase; (4) tolerance for advice generated from limited data; (5) the actual OCR/categorization/manual-review confidence threshold values; (6) whether budget periods must be strict calendar months or should support custom cycles.
- **No validating evidence yet for the underlying problem** ([[prob-1]] Evidence): this build proceeds as a hypothesis-driven bet, not a validated-need build — unchanged from proc-1's own assessment.
- **BP-NFR-1's threshold (10 seconds) is confirmed, not proposed**: it was directly given by the user (via the BRD's N4 target), not invented during this process.
