## Summary

This change implements all 26 remaining requirements plus quality attribute BP-NFR-1 from `srs-1/baseline.md`, extending proc-1's `lib/receipts/` sibling-module pattern with six new service areas — categorization, budget calculation, statistics, position-matching, goals, and a placeholder auth/security layer — exactly as the approved concept ([[prob-1/concept-1]]) directs. Every new area follows the interface-plus-mock-implementation-plus-orchestrator shape already established by `OcrProvider`/`MockOcrProvider`/`ReceiptStore`/`InMemoryReceiptStore`/`digitizeReceipt`. `lib/receipts/types.ts` was extended additively (new optional fields on `LineItem`, `ExtractedReceipt`, `StoredReceipt`); no existing field was removed or retyped. Two real Next.js screens were added — `app/receipts/page.tsx` (receipt list + category correction) and `app/budget/page.tsx` (monthly budget summary) — replacing the one-line stub `app/page.tsx` used to be the only page, which now links to both. All persistence remains in-memory; a new `lib/singletons.ts` module holds the process-lifetime store/provider instances, cached on `globalThis` so API routes and server-rendered pages genuinely share the same data (see Design notes — this required a fix found during manual browser verification, not just the plan's original design). Security requirements (REQ-22 encryption at rest, REQ-23/REQ-27 user association and isolation) are implemented as correctly-shaped logic against documented placeholders: `lib/security/encryption.ts` performs a real, reversible (but not cryptographically secure) transform so what `InMemoryReceiptStore` actually stores is ciphertext, not plaintext; `lib/auth/currentUser.ts` provides a second fixed test-user id so isolation logic is genuinely exercised, not merely assumed. `npm run build` and `npm test` are both clean (106 tests, 13 files), and the running app was manually verified end-to-end in a browser (receipt upload → list screen → category correction → budget summary), which is how the `globalThis` singleton bug and a `searchParams`-await bug were caught and fixed before sign-off.

## Requirements implemented

- [[prob-1/concept-1/req-1]] (REQ-4, confidence flagging) — `lib/receipts/parseReceipt.ts` (`getLowConfidenceFields`), surfaced on `StoredReceipt.lowConfidenceFields` by `digitizeReceipt`.
- [[prob-1/concept-1/req-2]] (REQ-5, manual-review routing) — `lib/receipts/parseReceipt.ts` (`getMissingRequiredFields`), applied in `lib/receipts/digitizeReceipt.ts` to set `status: "manual_review"`.
- [[prob-1/concept-1/req-3]] (REQ-7, categorize on parse) — `lib/categorization/categorizeReceipt.ts` (`categorizeReceiptLineItems`), `lib/categorization/categorizer.ts` (`MockCategorizer`).
- [[prob-1/concept-1/req-4]] (REQ-8, Uncategorized fallback) — `lib/categorization/categories.ts` (`CATEGORY_TAXONOMY`, `UNCATEGORIZED`).
- [[prob-1/concept-1/req-5]] (REQ-9, low-confidence routing) — `categorizeReceiptLineItems`'s threshold check against `lib/config.ts`'s `CATEGORIZATION_CONFIDENCE_THRESHOLD`.
- [[prob-1/concept-1/req-6]] (REQ-10, manual reassignment) — `lib/categorization/categorizeReceipt.ts` (`reassignLineItem`, `reassignCategoryAndLearn`), `app/api/receipts/[id]/route.ts` `PATCH`, `app/receipts/LineItemCategoryEditor.tsx`.
- [[prob-1/concept-1/req-7]] (REQ-11, learned corrections) — `lib/categorization/correctionStore.ts` (`InMemoryCorrectionStore`, exact-string match), applied by `categorizeReceiptLineItems` and recorded by `reassignCategoryAndLearn`.
- [[prob-1/concept-1/req-8]] (REQ-12, aggregate monthly spend) — `lib/budget/budgetService.ts` (`calculateMonthlyBudget`).
- [[prob-1/concept-1/req-9]] (REQ-13, exclude manual-review) — same function, `status !== "manual_review"` filter.
- [[prob-1/concept-1/req-10]] (REQ-14, incomplete-month labeling) — same function's `incomplete` flag.
- [[prob-1/concept-1/req-11]] (REQ-15, same-position matching) — `lib/positionMatching/positionMatching.ts` (`comparePositions`, exact match on name/unitPrice/quantity/totalPrice).
- [[prob-1/concept-1/req-12]] (REQ-16, comparison-not-possible) — `compareReceiptPhotos` in the same file.
- [[prob-1/concept-1/req-13]] (REQ-17, manual override) — `lib/positionMatching/overrideStore.ts` (`InMemoryOverrideStore`, `resolvePairClassification`).
- [[prob-1/concept-1/req-14]] (REQ-18, ranked category statistics) — `lib/statistics/statisticsService.ts` (`getCategoryStatistics`).
- [[prob-1/concept-1/req-15]] (REQ-19, no-data messaging) — same function's `hasData` flag.
- [[prob-1/concept-1/req-16]] (REQ-20, financial/lifestyle goals) — `lib/goals/goalStore.ts` (`InMemoryGoalStore`, `GoalType` union), `app/api/goals/route.ts`.
- [[prob-1/concept-1/req-17]] (REQ-21, insufficient-data messaging) — `lib/goals/adviceService.ts` (`getOptimizationAdvice`).
- [[prob-1/concept-1/req-18]] (REQ-22, encryption at rest) — `lib/security/encryption.ts` (`encryptAtRest`/`decryptAtRest`), applied inside `InMemoryReceiptStore`.
- [[prob-1/concept-1/req-19]] (REQ-23, single owning user) — `StoredReceipt.userId`, `InMemoryReceiptStore.allForUser`/`getForUser`.
- [[prob-1/concept-1/req-20]] (REQ-24, immediate-effect deletion) — `InMemoryReceiptStore.delete`, `app/api/receipts/[id]/route.ts` `DELETE`.
- [[prob-1/concept-1/req-21]] (REQ-25, excluded-count reporting) — `calculateMonthlyBudget`'s `excludedCount`.
- [[prob-1/concept-1/req-22]] (REQ-26, withhold recommendations) — `getOptimizationAdvice`'s `recommendation` field, present only when `sufficientData`.
- [[prob-1/concept-1/req-23]] (REQ-27, cross-user isolation) — `lib/auth/currentUser.ts` (`assertOwnership`), `InMemoryReceiptStore.getForUser`, enforced in `app/api/receipts/[id]/route.ts`.
- [[prob-1/concept-1/req-24]] (REQ-28, generic API-failure error) — `lib/errors.ts` (`ExternalApiError`), thrown by `MockOcrProvider`/`MockCategorizer` when constructed with a failure, caught in `app/api/receipts/route.ts` and returned as a 502 with a generic message, no auto-retry.
- [[prob-1/concept-1/req-25]] (REQ-29, receipt list + correction screen) — `app/receipts/page.tsx`, `app/receipts/LineItemCategoryEditor.tsx`.
- [[prob-1/concept-1/req-26]] (REQ-30, monthly budget summary screen) — `app/budget/page.tsx`.
- [[prob-1/concept-1/qa-1]] (BP-NFR-1, 10s parsing) — timed test in `lib/receipts/digitizeReceipt.test.ts` ("end-to-end parsing response time").

## Symbols changed

**lib/receipts/ (extended)**
- `lib/receipts/types.ts` — `LineItem` (+`category`, +`categoryFlaggedForReview`), `ExtractedReceipt` (+`lowConfidenceFields`), `StoredReceipt` (+`lowConfidenceFields`).
- `lib/receipts/ocrProvider.ts` — `OcrResult` (+`fieldConfidence`), new `OcrFieldConfidence`, `MockOcrProvider` (new optional `failure` constructor param for REQ-28).
- `lib/receipts/parseReceipt.ts` — `parseReceipt` (now also returns `lowConfidenceFields`), new `getLowConfidenceFields`, `getMissingRequiredFields`.
- `lib/receipts/receiptStore.ts` — `ReceiptStore` interface (+`allForUser`, `getForUser`, `update`, `delete`, `getEncryptedSnapshot`), `InMemoryReceiptStore` (internal representation now stores an encrypted cipher blob per record, decrypted on every read).
- `lib/receipts/digitizeReceipt.ts` — `digitizeReceipt` (new `categorizer`/`corrections` parameters; sets `status` from missing/low-confidence fields; categorizes line items before saving).

**New: lib/config.ts** — `OCR_CONFIDENCE_THRESHOLD`, `CATEGORIZATION_CONFIDENCE_THRESHOLD`, `MIN_RECEIPTS_FOR_ADVICE`.

**New: lib/errors.ts** — `ExternalApiError`, `ForbiddenError`.

**New: lib/auth/currentUser.ts** — `CURRENT_USER_ID`, `OTHER_TEST_USER_ID`, `assertOwnership`.

**New: lib/security/encryption.ts** — `encryptAtRest`, `decryptAtRest`.

**New: lib/categorization/** — `categories.ts` (`CATEGORY_TAXONOMY`, `UNCATEGORIZED`), `categorizer.ts` (`Categorizer`, `MockCategorizer`), `correctionStore.ts` (`CorrectionStore`, `InMemoryCorrectionStore`), `categorizeReceipt.ts` (`categorizeReceiptLineItems`, `reassignLineItem`, `reassignCategoryAndLearn`).

**New: lib/budget/budgetService.ts** — `calculateMonthlyBudget`, `MonthlyBudgetSummary`.

**New: lib/statistics/statisticsService.ts** — `getCategoryStatistics`, `CategoryStat`, `StatisticsResult`.

**New: lib/positionMatching/** — `positionMatching.ts` (`comparePositions`, `compareReceiptPhotos`), `overrideStore.ts` (`InMemoryOverrideStore`, `resolvePairClassification`).

**New: lib/goals/** — `goalStore.ts` (`InMemoryGoalStore`, `GoalType`, `Goal`), `adviceService.ts` (`getOptimizationAdvice`).

**New: lib/singletons.ts** — `receiptStore`, `ocrProvider`, `categorizer`, `correctionStore`, `goalStore`, `positionOverrideStore` (each cached on `globalThis.__budgetPlannerSingletons`).

**Routes (existing, modified)**
- `app/api/receipts/route.ts` — `POST` (now uses singletons, categorizer/corrections, catches `ExternalApiError`), new `GET` (user-scoped list).

**Routes (new)**
- `app/api/receipts/[id]/route.ts` — `GET`, `PATCH`, `DELETE`.
- `app/api/budget/route.ts` — `GET`.
- `app/api/statistics/route.ts` — `GET`.
- `app/api/positions/compare/route.ts` — `POST`.
- `app/api/positions/override/route.ts` — `POST`.
- `app/api/goals/route.ts` — `GET`, `POST`.
- `app/api/advice/route.ts` — `GET`.

**UI (new/modified)**
- `app/receipts/page.tsx` — `ReceiptsPage` (new).
- `app/receipts/LineItemCategoryEditor.tsx` — `LineItemCategoryEditor` (new, client component).
- `app/budget/page.tsx` — `BudgetPage` (new, made `async` to await `searchParams` per Next.js 15+/16's App Router requirement).
- `app/page.tsx` — `HomePage` (modified: links to the two new screens).

**Tests added**: `lib/receipts/digitizeReceipt.test.ts` (extended), `lib/receipts/parseReceipt.test.ts`, `lib/receipts/receiptStore.test.ts`, `lib/security/encryption.test.ts`, `lib/categorization/categorizeReceipt.test.ts`, `lib/budget/budgetService.test.ts`, `lib/statistics/statisticsService.test.ts`, `lib/positionMatching/positionMatching.test.ts`, `lib/goals/goals.test.ts`, `app/api/receipts/route.test.ts`, `app/api/receipts/[id]/route.test.ts`, `app/api/budget/route.test.ts`.

## Design notes

- **"Categorized, non-flagged receipts" (REQ-12, ambiguous per the baseline's Definitions)**: interpreted as "not `requires-manual-review`" — the only exclusion mechanism any requirement text actually defines (REQ-13). A receipt with Uncategorized line items still counts toward the total; only manual-review status removes it. Rejected alternative: requiring every line item to have a non-Uncategorized category before counting the receipt — this would make REQ-8's fallback effectively defeat REQ-12 for any receipt with an ambiguous item, which nothing in the requirement text supports.
- **REQ-11 matching strategy**: exact-string, case-sensitive, on merchant name + item name, per this stage's `unclear-requirements` answer (fuzzy matching explicitly rejected as unspecified scope).
- **REQ-15's "two distinct receipts are not same-position" scenario**: `compareReceiptPhotos` operates on `ParsedPhoto` (pre-persistence, ephemeral capture data), never on two already-separate `StoredReceipt` records — so there is no code path where the system would compare two independent purchases as a photo-split. Verified in `positionMatching.test.ts` by showing two distinct stored receipts with an identical item both remain in the store and both count toward the budget total (no dedup).
- **REQ-18 "transaction count"**: counted per line item (a category may span multiple line items across one or more receipts), not per receipt, since a single receipt can span multiple categories and the requirement text doesn't distinguish the two. Rejected per-receipt counting because it would double- or under-count receipts spanning categories.
- **REQ-20 goal type**: implemented as a plain two-value union (`"financial" | "lifestyle"`) with no further validation, per this stage's recorded decision. Multiple goals per user are additive (no replacement), consistent with the baseline's still-open "multiple/replacement goals undecided" note — additive is the conservative choice that discards nothing.
- **REQ-22 encryption scope**: there is no separate binary image-blob storage in this mock (proc-1 only ever stored an `imageRef` filename, never image bytes) — so "the stored image is encrypted" is satisfied by encrypting `imageRef` along with the rest of the record's payload inside `InMemoryReceiptStore`'s single ciphertext blob per record, documented explicitly as a placeholder in `lib/security/encryption.ts`'s doc comment. `id`/`userId`/`createdAt` are kept in the clear as index keys, mirroring how a real database wouldn't encrypt its primary/partition keys either.
- **Shared singletons (`lib/singletons.ts`)**: introduced because the new UI pages (server components) and the existing/new API routes must observe the same in-memory data. Without this, `app/receipts/page.tsx` would read from an empty store distinct from the one `app/api/receipts/route.ts` writes to. This is a new file, not a modification to an existing symbol, so it wasn't in the original blast-radius answer, but it was necessary once the UI screens were added — noted here and in Risks.
- **Singletons stashed on `globalThis`, not plain module-level `const`s**: manual browser verification against the running dev server (after the code_change draft was first registered) found that a receipt POSTed via `app/api/receipts/route.ts` was invisible to `app/receipts/page.tsx`'s direct store read — Next.js/Turbopack compiles route handlers and page server components as separate bundled entry points and does not guarantee a shared module instance between them, even within one process. Fixed by caching each singleton on `globalThis` (the one thing genuinely shared across every bundle in the same Node.js process), the standard Next.js workaround for this class of bug. Re-verified end-to-end via the browser after the fix: POST → GET → page render → PATCH (category reassignment) → page render all observe the same data. `npm run build` and `npm test` re-run clean after the fix (106/106).
- **`app/budget/page.tsx`'s `searchParams` prop**: also found during the same manual verification pass — the dev server logged `searchParams is a Promise and must be unwrapped with await` (a Next.js 15+/16 App Router requirement this file didn't follow). Fixed by making the page component `async` and awaiting `searchParams` before use.
- **UI testing**: no DOM-rendering test harness (jsdom / @testing-library) exists in this project (`vitest.config.ts` uses `environment: "node"`, and neither package is in `package.json`). Rather than add new dependencies mid-implementation (out of this stage's declared scope), the two screens are kept thin and delegate all business logic to already-unit-tested `lib/` functions (`calculateMonthlyBudget`, `categorizeReceiptLineItems`/`reassignCategoryAndLearn`); the API routes both screens call are integration-tested directly via `NextRequest`/route-handler calls in `app/api/**/*.test.ts`. This is also why the `globalThis` singleton bug survived the automated test suite entirely: unit tests call `lib/` functions directly and never cross the route-handler/page bundle boundary where the bug actually lived, and it was caught only by loading the running app in a browser.

## Risks

- **Scope was wider than the plan step's blast-radius answer declared**: that answer named `InMemoryReceiptStore`, `StoredReceipt`, and `digitizeReceipt` as the touched existing symbols. In addition, `lib/receipts/ocrProvider.ts` (`OcrResult`, `MockOcrProvider`) and `lib/receipts/parseReceipt.ts` (`parseReceipt`) were also modified — both were already surfaced by this stage's own `impact()` calls (OcrResult/ReceiptStore/parseReceipt upstream results, all LOW/MEDIUM risk, confined to `lib/receipts/*` and `app/api/receipts/route.ts`), so nothing outside the graph's own predicted blast radius broke, but the plan's answer didn't name these two files explicitly. `app/page.tsx` was also modified (a one-line stub, low risk) to link to the new screens, which also wasn't named in the plan.
- **`digitizeReceipt`'s signature changed** (two new required parameters: `categorizer`, `corrections`) rather than staying purely additive. This was necessary to compose categorization into the same orchestrator that already composes OCR + validation + persistence, per the approved concept's "one orchestrator per flow" pattern — but it is a breaking change to that function's call signature, not an additive one. The sole caller (`app/api/receipts/route.ts`) and the existing test file were both updated in this same change.
- **Encryption and isolation are placeholders, not real security** — `lib/security/encryption.ts` uses a fixed-key XOR cipher (real transform, not real cryptography) and `lib/auth/currentUser.ts` hardcodes two user ids with no real session/authentication. Both are documented plainly in their own file headers per the concept's Risks section, but a reader who skips those comments could still mistake REQ-22/REQ-23/REQ-27 for production guarantees.
- **Confidence thresholds and minimum-receipt-for-advice are invented defaults** (`lib/config.ts`: 0.7, 0.6, 5) since the baseline left these as open configuration values with no number confirmed. Acceptance scenarios that reference "the configured threshold" pass against these defaults, but a different real-world value could change behavior at the margins (e.g. a receipt that is borderline-flagged today might not be under a different threshold).
- **REQ-15/REQ-16/REQ-17 (position matching) have no persisted multi-photo capture flow wired to the receipt store** — `compareReceiptPhotos`/`InMemoryOverrideStore` are implemented and tested as standalone services with an API route, but nothing yet connects "upload two photos of one long receipt" end-to-end into `digitizeReceipt`'s save path. This matches the should-have priority and the concept's scope (a dedicated `/api/positions/compare` route), but a user cannot yet trigger this from the UI — only via the API.
- **No real multi-currency/PLN formatting** — goal descriptions and budget totals are plain numbers/strings; REQ-20's "save 500 PLN" example is stored as free-text `description`, not a structured currency+amount, since the baseline explicitly leaves multi-currency out of scope.
- **`globalThis` singleton caching survives Next.js dev-mode bundle separation but is still process-lifetime only** — it does not make the mock store durable across a real restart, and does not, by itself, make it safe for a genuinely multi-process/serverless production deployment (where each function invocation could be a cold, separate process with its own `globalThis`). That deeper limitation was already disclosed as out of scope for this process (no real Postgres); the `globalThis` fix here only makes the mock behave consistently within one running dev/server process, which is what this process's placeholder scope requires.
