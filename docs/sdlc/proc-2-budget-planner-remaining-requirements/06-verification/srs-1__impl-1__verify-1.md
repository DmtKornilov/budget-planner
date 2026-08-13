## Commands run

- `MERIDIAN_LBUG_BUFFER_POOL_SIZE=2147483648 node .meridian/run.cjs analyze --index-only --pdg --allow-sdlc-reindex` — succeeded (the plain command without the buffer-pool override hit the known 256 MiB exhaustion quirk on this machine and had to be retried with the override). Result: 1,957 nodes | 2,852 edges | 35 clusters | 16 flows, indexed at 2026-08-13T15:22:57.021Z.
- `meridian sdlc verify-links` — exit 0. checked=0, ok=0, repaired=0, unresolved=[]. Nothing to repair: this stage's inputs are the requirement/feature-file artifacts from srs-1, which trace to feature files, not directly to implementation code, so there were no artifact-to-code links stamped against the pre-implementation index to re-anchor.
- `npm test` (`vitest run`) — first run: 13 test files, 106 tests, all passing. After adding two targeted tests to close real coverage gaps found during this stage (see Results below): 14 test files, 109 tests, all passing.
- `npm run build` — clean (all 11 routes compile, TypeScript passes). Run standalone, not concurrently with any other build/dev process, to avoid the Windows lock-contention issue already documented in the implementation stage.
- Manual browser verification (already performed during the implementation stage, re-confirmed here as evidence rather than re-run): receipt upload → `/receipts` list screen showing the merchant and category → category reassignment via the UI persisting on reload → `/budget` summary screen showing a real month-to-date total. This is the only verification the two new UI screens (REQ-29, REQ-30) have, since this project has no DOM-rendering test harness (no jsdom/@testing-library in `package.json`, `vitest.config.ts` uses `environment: "node"`) — see Known gaps.

## Results

All automated checks pass: build clean, 109/109 tests passing, no lint tool configured (`lint-command` = none, confirmed by absence of any `.eslintrc*`/`eslint.config.*` file and no `lint` script in `package.json`).

While mapping every approved acceptance scenario to its covering test (below), two real, legitimate gaps were found — not "no test exists because nothing was written," but specific missing assertions:

- **REQ-24** (immediate-effect deletion): the existing delete tests in `lib/receipts/receiptStore.test.ts` only asserted that a deleted receipt disappeared from `store.all()`/`store.get()` — none of them actually computed a budget total after deletion, so the requirement's actual claim ("the visible total updates") was unverified even though the underlying mechanism (store correctly excludes deleted receipts, `budgetService` correctly sums over whatever the store returns) was very likely correct by composition. **Fixed**: added `"deleting one of several receipts updates the visible monthly total"` (asserts 150 → 100 after deleting one of three 50-unit receipts) and strengthened `"zeroes out a month's total when the last receipt is deleted"` to call `calculateMonthlyBudget` and assert `total === 0`, rather than only checking the store is empty.
- **REQ-23** (associate all data with a single owning user account): the "derived statistics carry the same ownership" and "statistics are isolated from another user's data" scenarios had no test at all — `app/api/statistics/route.ts` implements the scoping (`receiptStore.allForUser(CURRENT_USER_ID)` before calling `getCategoryStatistics`), but no test file for that route existed to prove it. **Fixed**: added `app/api/statistics/route.test.ts` with a test that creates one receipt for the current user and one for a second test user, requests statistics, and asserts the current user's category appears while the other user's category does not.

No test was changed to make it pass by weakening an assertion — both fixes added a genuine new assertion (an actual computed total, an actual cross-user check) that would fail if the underlying behavior regressed.

## Acceptance coverage

24 of 26 approved requirements have full scenario-to-test coverage (every scenario has a specific covering test). 2 requirements (REQ-23, REQ-24) had partial gaps that are now closed by this stage's added tests. REQ-29 and REQ-30 (the two new UI screens) have zero automated test coverage for any scenario — see Known gaps.

| Requirement | Scenario | Test |
|---|---|---|
| [[prob-1/concept-1/req-1]] REQ-4 | field at/above threshold accepted | `lib/receipts/digitizeReceipt.test.ts` / `lib/receipts/parseReceipt.test.ts` — "accepts a field at or above the threshold" |
| REQ-4 | field exactly at threshold not flagged | digitizeReceipt.test.ts / parseReceipt.test.ts — "treats a field exactly at the threshold as acceptable" |
| REQ-4 | flag a single low-confidence field | digitizeReceipt.test.ts — "flags a single low-confidence field" |
| REQ-4 | flag multiple low-confidence fields independently | digitizeReceipt.test.ts — "flags multiple low-confidence fields independently" |
| [[prob-1/concept-1/req-2]] REQ-5 | successfully parsed receipt included normally | digitizeReceipt.test.ts — "does not mark a successfully parsed receipt for manual review" |
| REQ-5 | missing total triggers manual review | digitizeReceipt.test.ts — "marks a receipt with a missing total amount as requires-manual-review" |
| REQ-5 | missing date triggers manual review | digitizeReceipt.test.ts — "marks a receipt with a missing transaction date as requires-manual-review" |
| REQ-5 | missing both triggers a single marking | digitizeReceipt.test.ts — "marks a receipt missing both fields as requires-manual-review exactly once" |
| [[prob-1/concept-1/req-3]] REQ-7 | automatically categorize a recognized item | `lib/categorization/categorizeReceipt.test.ts` — "assigns a recognized item to its category" |
| REQ-7 | categorize each item on a multi-category receipt | categorizeReceipt.test.ts — "categorizes each item ... independently" |
| [[prob-1/concept-1/req-4]] REQ-8 | Uncategorized available before any receipts exist | categorizeReceipt.test.ts — "is listed in the category taxonomy before any receipts exist" |
| REQ-8 | Uncategorized remains selectable | categorizeReceipt.test.ts — "is selectable as a line item's category" |
| [[prob-1/concept-1/req-5]] REQ-9 | high confidence assigns real category | categorizeReceipt.test.ts — "assigns the real category without flagging when confidence is above the threshold" |
| REQ-9 | confidence exactly at threshold acceptable | categorizeReceipt.test.ts — "treats confidence exactly at the threshold as acceptable" |
| REQ-9 | fallback to Uncategorized below threshold | categorizeReceipt.test.ts — "falls back to Uncategorized and flags for review below the threshold" |
| [[prob-1/concept-1/req-6]] REQ-10 | reassign a line item's category | categorizeReceipt.test.ts / `app/api/receipts/[id]/route.test.ts` — PATCH "reassigns the category and it persists on a later GET" |
| REQ-10 | reassigned category persists on later view | categorizeReceipt.test.ts — "stores the reassigned category so it still shows on a later read" |
| [[prob-1/concept-1/req-7]] REQ-11 | correction applies to later receipt, same merchant | categorizeReceipt.test.ts — "applies a correction to a later receipt from the same merchant" |
| REQ-11 | correction does not apply to a different merchant | categorizeReceipt.test.ts — "does not apply the correction ... from a different merchant" |
| [[prob-1/concept-1/req-8]] REQ-12 | calculate a completed month's total | `lib/budget/budgetService.test.ts` — "sums all line-item totals for the requested month" |
| REQ-12 | use transaction date, not upload date | budgetService.test.ts — "uses transaction date, not upload date, for month assignment" |
| REQ-12 | month with no receipts returns zero | budgetService.test.ts — "returns a zero total for a month with no receipts" |
| REQ-12 | flagged receipts excluded from total | budgetService.test.ts — "excludes flagged (manual_review) receipts from the total" |
| [[prob-1/concept-1/req-9]] REQ-13 | month with no flagged receipts includes everything | budgetService.test.ts — "includes everything when nothing is flagged" |
| REQ-13 | exclude a flagged receipt from an otherwise valid month | budgetService.test.ts — "excludes flagged receipts from an otherwise valid month" |
| REQ-13 | all receipts flagged results in zero total | budgetService.test.ts — "returns zero when every receipt in the month is flagged" |
| [[prob-1/concept-1/req-10]] REQ-14 | in-progress month labeled incomplete | budgetService.test.ts — "labels an in-progress month as incomplete" |
| REQ-14 | completed month not labeled incomplete | budgetService.test.ts — "does not label a completed month as incomplete" |
| [[prob-1/concept-1/req-11]] REQ-15 | identical position split across two photos | `lib/positionMatching/positionMatching.test.ts` — "classifies an identical item split across two photos as same position" |
| REQ-15 | single mismatched field → different position (4 examples) | positionMatching.test.ts — parameterized `it.each` over name/price/quantity/total |
| REQ-15 | recurring purchase across distinct receipts is not same position | positionMatching.test.ts — "does not treat a recurring purchase across two distinct receipts as the same position" |
| [[prob-1/concept-1/req-12]] REQ-16 | both photos parse successfully | positionMatching.test.ts — "returns a normal comparison result when both photos parse successfully" |
| REQ-16 | one photo fails to parse | positionMatching.test.ts — "returns comparison-not-possible with a parsing-failure reason when one photo fails to parse" |
| REQ-16 | both photos fail to parse | positionMatching.test.ts — "... when both photos fail to parse" |
| [[prob-1/concept-1/req-13]] REQ-17 | override same-position to different | positionMatching.test.ts — "overrides an automatic same-position determination to different-position" |
| REQ-17 | override different-position to same | positionMatching.test.ts — "overrides an automatic different-position determination to same-position" |
| REQ-17 | override persists across later re-comparison | positionMatching.test.ts — "keeps the manual override across a later automatic re-comparison" |
| [[prob-1/concept-1/req-14]] REQ-18 | category breakdown for a calendar month | `lib/statistics/statisticsService.test.ts` — "returns total spend, percentage share, and transaction count per category, ranked descending" |
| REQ-18 | category breakdown for a custom date range | statisticsService.test.ts — "limits totals to a custom date range" |
| REQ-18 | date range contains no receipts | statisticsService.test.ts — "returns an empty breakdown without an error when the range has no receipts" |
| [[prob-1/concept-1/req-15]] REQ-19 | statistics for a period with data | statisticsService.test.ts — "reports data available for a period with receipts" |
| REQ-19 | period with exactly one receipt | statisticsService.test.ts — "reports data available for a period with exactly one receipt" |
| REQ-19 | period with no data | statisticsService.test.ts — "informs the caller no receipts were found for a period with no data" |
| [[prob-1/concept-1/req-16]] REQ-20 | define a financial goal | `lib/goals/goals.test.ts` — "stores a financial goal against the user's account" |
| REQ-20 | define a lifestyle goal | goals.test.ts — "stores a lifestyle goal against the user's account" |
| REQ-20 | define a second goal while one exists | goals.test.ts — "stores both goals when a second goal is set while one already exists" |
| [[prob-1/concept-1/req-17]] REQ-21 | sufficient data produces real advice | goals.test.ts — "returns actual advice once the minimum number of receipts is met" |
| REQ-21 | receipt count exactly at minimum | goals.test.ts — "returns actual advice when the count exactly equals the minimum" |
| REQ-21 | insufficient data for advice | goals.test.ts — "informs the user more historical data is needed below the minimum" |
| [[prob-1/concept-1/req-18]] REQ-22 | receipt images encrypted at rest | `lib/receipts/receiptStore.test.ts` — "stores the receipt image reference encrypted at rest" |
| REQ-22 | extracted data encrypted at rest | receiptStore.test.ts — "stores extracted receipt and line-item data encrypted at rest" |
| REQ-22 | updated data remains encrypted at rest | receiptStore.test.ts — "keeps updated data encrypted at rest after a category correction" |
| [[prob-1/concept-1/req-19]] REQ-23 | stored receipt carries submitting user's account id | receiptStore.test.ts — "carries the submitting user's account id on the stored receipt" |
| REQ-23 | derived statistics carry the same ownership | **`app/api/statistics/route.test.ts`** — "scopes category statistics to the current user only, isolated from another user's data" (added this stage) |
| REQ-23 | statistics for one user isolated from another | same test as above (added this stage) |
| [[prob-1/concept-1/req-20]] REQ-24 | deleting one of several receipts updates the visible total | **receiptStore.test.ts** — "deleting one of several receipts updates the visible monthly total" (added this stage) |
| REQ-24 | deleting the last receipt zeroes the total | receiptStore.test.ts — "zeroes out a month's total when the last receipt is deleted" (strengthened this stage to assert the actual computed total) |
| [[prob-1/concept-1/req-21]] REQ-25 | no exclusion note when nothing excluded | budgetService.test.ts — "reports zero exclusions when nothing is excluded" |
| REQ-25 | report count when one receipt excluded | budgetService.test.ts — "reports exactly one excluded receipt" |
| REQ-25 | report count when receipts excluded | budgetService.test.ts — "reports two excluded receipts" |
| [[prob-1/concept-1/req-22]] REQ-26 | specific recommendation when data sufficient | goals.test.ts — "generates a specific recommendation when data is sufficient" |
| REQ-26 | recommendation when count exactly meets minimum | goals.test.ts — "generates a specific recommendation when the count exactly meets the minimum" |
| REQ-26 | no recommendation below minimum | goals.test.ts — "does not generate a specific recommendation below the minimum" |
| [[prob-1/concept-1/req-23]] REQ-27 | user's list never includes another user's receipts | receiptStore.test.ts / `app/api/receipts/route.test.ts` — "returns only the current user's receipts" |
| REQ-27 | direct access to another user's receipt denied | receiptStore.test.ts / `app/api/receipts/[id]/route.test.ts` — "denies access when a different user requests it" |
| [[prob-1/concept-1/req-24]] REQ-28 | successful calls produce a normal result | app/api/receipts/route.test.ts — "digitizes a supported photo and returns 201" |
| REQ-28 | OCR failure surfaces a generic error | digitizeReceipt.test.ts — "propagates an ExternalApiError from the OCR provider without swallowing it" |
| REQ-28 | LLM failure surfaces a generic error | digitizeReceipt.test.ts — "propagates an ExternalApiError from the categorizer without swallowing it" |
| [[prob-1/concept-1/req-25]] REQ-29 | view and correct a line item's category | **none** — see Known gaps (manual browser verification only) |
| REQ-29 | empty state with no receipts | **none** — see Known gaps |
| REQ-29 | line item with no category still shown/correctable | **none** — see Known gaps |
| [[prob-1/concept-1/req-26]] REQ-30 | in-progress month shows incomplete + count | **none** — see Known gaps |
| REQ-30 | completed month not labeled incomplete | **none** — see Known gaps |
| REQ-30 | empty state, no receipts for the month | **none** — see Known gaps |
| [[prob-1/concept-1/qa-1]] BP-NFR-1 | 10s parsing threshold | digitizeReceipt.test.ts — timed "end-to-end parsing response time" test |

## Known gaps

- **REQ-29 and REQ-30 (the two new UI screens) have no automated test coverage.** This project has no DOM-rendering test harness — no `jsdom`/`@testing-library` dependency, and `vitest.config.ts` is configured with `environment: "node"`. Adding one was considered and explicitly rejected during the implementation stage as scope creep for this process (see the implementation change note's Design notes). The screens are kept thin, delegating all business logic to already-unit-tested `lib/` functions and already-route-tested API endpoints, and both were manually verified end-to-end in a running browser during implementation: receipt upload → list screen shows merchant/category → category correction persists on reload → budget summary shows the correct total with the correct incomplete label. That manual pass is what this process is taking on trust in place of an automated test for these two requirements — a future process that adds a DOM test harness should backfill this.
- **The "try again" message text for REQ-28** is asserted only by the fact that an `ExternalApiError` reaches the route handler and is turned into a generic 502 (verified by test) and by the manual browser pass (which showed the literal message) — no automated test asserts the exact user-facing string, since that's UI copy rather than a structural contract.
- **`lint-command` is "none"** because this project has no linter, formatter, or standalone type-checker configured beyond what `next build` runs (`tsc` as part of the build pipeline). This was confirmed by checking for `.eslintrc*`/`eslint.config.*` and a `lint` script — neither exists — not assumed.
- **The knowledge-graph index reflects the current working tree, not a new commit** — nothing in this process has been committed yet (that happens in the delivery stage). `verify-links` found nothing to repair because this stage's registered artifacts (the srs-1 requirements/features) trace to feature files, not directly to implementation symbols, so there was no stale artifact-to-code link to break in the first place.
