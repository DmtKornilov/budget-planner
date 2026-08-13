
# Solution Concept — Budget Planner (Remaining Requirements)

Derived from [[prob-1]], the approved problem brief: a user who digitizes a receipt still cannot see where their spending sits, whether it fits their budget, or whether they're moving toward a goal (see [[prob-1]] `## Problem`).

Research into the actual codebase (not just proc-1's approved concept) found that proc-1's chosen direction — Postgres, a hosted OCR API, an LLM API, PaaS deployment — was approved but never implemented. What exists today is 100% in-memory/mocked: `InMemoryReceiptStore` (a `Map` in one Node process), `MockOcrProvider` (one hardcoded fixture), and no auth at all (`userId` hardcoded to `"dev-user"`). This is the real starting point for every option below. (from the answer to `existing-architecture`)

## Options considered

### Option 1 — Extend the existing lib/ sibling-module pattern

Add each of the 6 new service areas (categorization, budget calculation, multi-photo position-matching, statistics, goal advice, and a security/auth placeholder) as sibling modules under `lib/`, each following the shape proc-1 already established: an interface, a mock/in-memory implementation of it, and an orchestrator function that composes collaborators — the same pattern as `lib/receipts/{ocrProvider,receiptStore,digitizeReceipt}.ts`. Each gets its own route(s) under `app/api/`.

- **Cost against appetite** (a few weeks, per the answer to `appetite`): fits well — no new architectural style to design, just repeating a pattern that already works six more times.
- **Gives up**: any opportunity to reorganize the growing module count; by the end of this process `lib/` will have 6-7 sibling directories with no shared layering.
- **Changing your mind later**: cheap for swapping any one placeholder (OCR, store, auth) for real infrastructure, since each sits behind its own interface — that swap was already proven low-cost when proc-1 built the pattern. Reorganizing the module layout later, if it becomes unwieldy, is a bigger but still bounded refactor.

### Option 2 — Layered refactor first, then add services

Before writing any of the 6 new areas, restructure the codebase into explicit domain/service/repository layers (e.g. a `domain/` layer for pure logic, a `services/` layer for orchestration, a `repositories/` layer for storage), then build the new requirements inside that structure.

- **Cost against appetite**: doesn't fit well — the refactor itself is not-zero work against a few-weeks budget that also has to cover 24 requirements, and the codebase is currently small enough (one route, five files) that there's no concrete evidence yet it needs the extra layering.
- **Gives up**: schedule margin, for a benefit (long-term maintainability of a larger codebase) that isn't yet a live problem.
- **Changing your mind later**: this option is itself the "change your mind" move — doing it later, once there's real evidence the flat sibling-module structure is straining, costs about the same as doing it now, so there's no urgency premium to doing it first.

### Option 3 — Single combined facade module

Build all 6 new areas as methods on one `BudgetService` facade instead of separate modules — one file (or a small cluster) handling categorization, budget math, matching, stats, and advice together.

- **Cost against appetite**: fastest to wire up initially — fewer files, fewer interfaces to define.
- **Gives up**: the ability to swap or test one concern independently of another (e.g. replacing the mock categorization logic with a real LLM call without touching goal-advice code in the same file); also gives up consistency with the pattern proc-1 already established, introducing a second style in the same small codebase.
- **Changing your mind later**: expensive — splitting a facade back into independent modules after logic has accreted inside it is a real refactor, not a config change.

### Option 4 — Do nothing further (baseline)

Leave the codebase as proc-1 delivered it. Don't build categorization, budget calculation, matching, statistics, goal advice, or the security NFRs in this process.

- **Cost against appetite**: zero.
- **Gives up**: the entire remaining value described in [[prob-1]] `## Problem` — a user can digitize a receipt but still cannot see where their money goes, stay within budget, or work toward a goal. This is the baseline every other option is measured against, not a real contender given the user has already committed to delivering this scope.
- **Changing your mind later**: N/A — nothing is built to reverse.

## Chosen approach

Option 1, extend the existing `lib/` sibling-module pattern: confirmed by the user (see the answer to `chosen-direction`).

- Six new sibling areas under `lib/`: `categorization/`, `budget/`, `statistics/`, `positionMatching/`, `goals/`, and an `auth/` placeholder — each with an interface plus a mock/in-memory implementation, matching how `lib/receipts/` is already built.
- New routes under `app/api/` for each area (categorize, budget summary, stats, receipt comparison, goals, delete), alongside the existing `app/api/receipts/route.ts`.
- The in-memory `ReceiptStore` and mocked `OcrProvider` continue as-is; `StoredReceipt` and related types are extended (category field, confidence fields, status flags) rather than replaced.
- Security NFRs (req-22 encryption at rest, req-23/req-27 per-user isolation) are implemented as correctly-shaped logic against a placeholder auth/encryption foundation, not real infrastructure — per the answer to `constraints`, the gap is to be documented, not silently closed or ignored.
- No real Postgres, no real auth provider, no real LLM/OCR API integration in this process.

This directly addresses [[prob-1]] `## Problem` by giving the user the missing pieces (categorization, budget totals, stats, matching, advice) on top of what proc-1 already digitizes, and moves [[prob-1]] `## Success metrics` (goal engagement) from "impossible, nothing to engage with" to "possible, once instrumentation exists."

## Why not the alternatives

- **Option 2 (layered refactor first)** was not chosen because there is no evidence yet that the current flat structure is causing real pain — it's one route and five files — and spending part of a few-weeks budget on a refactor with no concrete driver would eat directly into time available for the 24 requirements themselves.
- **Option 3 (single facade)** was not chosen because it would mix unrelated concerns (categorization logic, goal-advice logic, matching logic) in one place, making it harder to test or swap any one of them independently, and it breaks consistency with the sibling-module pattern proc-1 already established in the same codebase — introducing a second architectural style for no offsetting benefit.
- **Option 4 (do nothing)** was not chosen because it delivers none of the remaining value in [[prob-1]] `## Problem` — it's the required baseline, not a real contender, since the user has already committed to building this scope.

## Constraints

- Keep extending the mock/in-memory approach — no real Postgres persistence, no real auth provider wired up in this process (answer to `constraints`).
- Security NFRs (encryption at rest, per-user isolation) must be implemented as correctly-shaped logic against a placeholder foundation, with the placeholder-vs-real gap documented rather than hidden (answer to `constraints`).
- Appetite is a few weeks for all 24 remaining requirements across 6 service areas (answer to `appetite`).
- Existing architecture is 100% mock/in-memory with no auth, constraining every option to build on top of placeholders rather than real infrastructure (answer to `existing-architecture`).

## Assumptions

- The existing `OcrProvider`/`ReceiptStore` interface boundaries are stable enough to extend (new fields, new methods) without a breaking rewrite — *cheap to check now*, by reading the interfaces before starting (already done: see `existing-architecture`).
- A placeholder single-user or fake-multi-user auth concept is sufficient to shape req-23/req-27's isolation logic correctly, even without real authentication — *only discoverable later*, once the actual isolation logic is written and it becomes clear whether the placeholder genuinely exercises the isolation boundary or merely assumes it.
- The category taxonomy referenced by req-7 through req-11 can be a reasonable fixed list defined during requirements/design, without waiting for the business-provided taxonomy proc-1's problem brief flagged as an assumption — *only discoverable later*, this process will have to either invent a placeholder taxonomy or escalate the open question if it blocks requirements.
- Six sibling modules under `lib/` will not become unwieldy to navigate within this process's scope — *cheap to check now*, the existing five-file `lib/receipts/` directory is a reasonable proxy for how one of the six new areas will look.

## Risks

- **Placeholder security logic could be mistaken for real security** if the documentation of the gap (mock auth, no real encryption) is not prominent enough — could mislead a future reader into thinking req-22/req-23/req-27 are actually satisfied in production terms. Early signal: check that every placeholder's code comments and the eventual acceptance/verification docs state plainly what is real vs. simulated, the same way `MockOcrProvider`'s comment already does.
- **24 requirements across 6 areas in a few weeks is a significant scope-to-time ratio**, larger relative to proc-1's own ~2-week-for-4-requirements pace. Early signal: if categorization and budget calculation (the two must-have areas) aren't working cleanly by roughly the midpoint, should-have/could-have areas (multi-photo matching, stats, goal advice) are at risk and scope should be cut, not schedule stretched silently.
- **No evidence yet that the underlying problem is real** (carried from [[prob-1]] `## Evidence`) — this process continues to build against an unvalidated hypothesis. Early signal: unchanged from proc-1's assessment; still worth revisiting before further spend beyond this process.
- **Confidence-threshold values remain undefined** (carried from [[prob-1]] `## Open questions`) — req-4 and req-9 depend on a threshold that has no number yet. Early signal: this will surface concretely once requirements for req-4/req-9 are drafted and need an actual value or an explicit "left as configuration" statement.

## Out of scope

Carried forward from [[prob-1]] `## Out of scope`: bank/card integration, multi-currency conversion, shared/household budgets, automated bill payment/transaction execution, tax filing/advice. Also carried forward: work already delivered by proc-1 (format validation/rejection, structured extraction) is not being redone.

Newly excluded by this choice of approach:
- Real Postgres persistence and any real auth provider — explicitly deferred past this process (see `## Constraints`).
- Real OCR and LLM API integration — categorization and goal advice continue to be implemented as mocked/rule-based logic behind the same kind of interface `MockOcrProvider` already demonstrates, not wired to a live third-party API.
- Any layered architectural refactor of the existing codebase (Option 2) — not undertaken as part of delivering these requirements.
