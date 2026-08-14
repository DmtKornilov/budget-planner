# Requirements Baseline: Budget Planner UI Design Mockup

## Purpose

This document is the frozen reference for the Budget Planner UI Design Mockup piece of work. Design and implementation are committed against exactly what is written here — the 10 functional requirements, 2 quality attributes, and their acceptance scenarios, all traced back to [[prob-1]] (the problem) and [[prob-1/concept-1]] (the chosen approach: native CSS Modules + shared design tokens, applied across the app's screens).

## Scope

**In scope** (from [[prob-1/concept-1]] Chosen approach): a shared design-token stylesheet; styling the home screen, receipts list screen, budget summary screen, and the line-item category editor; a shared page shell in the root layout; styling the existing empty states (receipts list, budget summary) and the existing category-save error state; preserving all existing functional behavior unchanged.

**Out of scope** (from [[prob-1]] and [[prob-1/concept-1]], Out of scope sections): any change to receipt parsing, categorization, budget calculation, statistics, position-matching, goals, security/encryption, or the mocked/in-memory backend; adopting any CSS framework, component library, or CSS-in-JS tooling (Tailwind, styled-components, MUI, Chakra, etc.); building a reusable component library intended for use beyond this app's screens; any dark-mode/theming system beyond the single palette defined by the tokens; a formal accessibility audit beyond the WCAG contrast target in UI-NFR-2.

## Definitions

- **Shared design tokens** — the color palette, typography scale, and spacing scale defined once (per [[prob-1/concept-1/req-1]]) and referenced by every screen, rather than each screen defining its own values.
- **Large text** (used in UI-NFR-2's contrast threshold) — the standard WCAG sense: text at 18pt (24px) regular weight or larger, or 14pt (18.66px) bold or larger. Everything else counts as normal text for the 4.5:1 threshold.
- **Requires manual review**, **incomplete (month in progress)**, **excluded pending review** — pre-existing application status values and messages from the current codebase (`app/receipts/page.tsx`, `app/budget/page.tsx`). This piece of work does not redefine their meaning or the logic that triggers them ([[prob-1/concept-1/req-9]] preserves that logic unchanged) — it only styles their existing presentation.
- **Screen** (as used loosely throughout this process's documents, including in [[prob-1/concept-1/req-10]]'s wording) — in most requirements this means one of the app's three routed pages (`app/page.tsx`, `app/receipts/page.tsx`, `app/budget/page.tsx`). The line-item category editor is not a fourth routed screen; it is a component embedded within the receipts list page and inherits that page's shell and tokens rather than needing its own separate page shell instance. See Open questions and assumptions.

## Functional requirements

### UI-1 — Shared design tokens (must, verification: inspection)

The application shall define a single shared set of design tokens — a color palette, a typography scale, and a spacing scale — used consistently across the home, receipts list, budget summary, and line-item category editor screens.

### UI-2 — Style home screen (must, verification: demonstration)

The application shall style the home screen's heading, description text, and navigation links using the shared design tokens.

### UI-3 — Style receipts list screen (must, verification: demonstration)

The application shall style the receipts list screen's receipt sections and line-item table using the shared design tokens.

### UI-4 — Style budget summary screen (must, verification: demonstration)

The application shall style the budget summary screen's total amount, incomplete-month indicator, and excluded-receipt count using the shared design tokens.

### UI-5 — Style line-item category editor (must, verification: demonstration)

The application shall style the line-item category editor's category selector using the shared design tokens.

### UI-6 — Style receipts-list empty state (must, verification: demonstration)

If the receipts list screen has no receipts to display, then the application shall show the existing empty-state message styled using the shared design tokens.

### UI-7 — Style budget-summary empty state (must, verification: demonstration)

If the budget summary screen has no receipts recorded for the selected month, then the application shall show the existing empty-state message styled using the shared design tokens.

### UI-8 — Style category-save error state (must, verification: demonstration)

If a line-item category change fails to save, then the application shall show the existing inline error message styled using the shared design tokens.

### UI-9 — Preserve existing functional behavior (must, verification: test)

The application shall preserve the existing functional behavior of the four screens — receipt display, category reassignment, and budget calculation — unchanged while the visual design in this piece of work is applied.

### UI-10 — Shared page shell in root layout (must, verification: demonstration)

The application shall provide a shared page shell — a consistent page wrapper and heading/navigation treatment — in the root layout, applied across the home, receipts list, budget summary, and line-item category editor screens.

## Quality attributes

### UI-NFR-1 — No new dependencies (must)

**Statement:** While this UI design work is being implemented, the application shall add zero new npm dependencies to `package.json`.

| | |
|---|---|
| metric | count of new entries added to `dependencies` or `devDependencies` in `package.json` |
| threshold | 0 |
| conditions | measured as a diff of `package.json` between the commit before this work started and the commit at delivery |
| method | inspection |

### UI-NFR-2 — Text contrast (must)

**Statement:** While the design tokens define text and background colors, the application shall provide a contrast ratio between body text and its background that meets the stated threshold.

| | |
|---|---|
| metric | contrast ratio (WCAG relative luminance formula) between each token pairing used for body text and its background, and for large text/heading and its background |
| threshold | 4.5:1 for normal body text; 3:1 for large text and headings |
| conditions | measured against the final color tokens defined in the shared stylesheet, using a standard WCAG contrast calculation |
| method | analysis |

Provenance: proposed by the maker as a default (no numeric target was originally given) and explicitly confirmed by the user via the `contrast-target` question — see Open questions and assumptions.

## Acceptance scenarios

Each requirement's Gherkin scenarios are lifted verbatim into `features/UI-<n>.feature` alongside this document. Summary:

| Requirement | Feature file | Scenario count |
|---|---|---|
| UI-1 | features/UI-1.feature | 3 |
| UI-2 | features/UI-2.feature | 3 |
| UI-3 | features/UI-3.feature | 4 |
| UI-4 | features/UI-4.feature | 5 |
| UI-5 | features/UI-5.feature | 2 |
| UI-6 | features/UI-6.feature | 2 |
| UI-7 | features/UI-7.feature | 3 |
| UI-8 | features/UI-8.feature | 3 |
| UI-9 | features/UI-9.feature | 4 |
| UI-10 | features/UI-10.feature | 4 |

Quality attributes UI-NFR-1 and UI-NFR-2 have no Gherkin scenarios — both are verified by inspection/analysis respectively, not observable behavior.

## Traceability matrix

See `traceability-matrix.md`.

## Open questions and assumptions

- **Terminology imprecision (assumption, not blocking):** [[prob-1/concept-1/req-10]]'s statement refers to a "line-item category editor screen," but `LineItemCategoryEditor.tsx` is a component embedded in the receipts list page, not a separately routed screen. This was caught during the acceptance stage; it does not change what is built — the editor correctly inherits the receipts page's shell and tokens rather than needing a separate shell instance — but is recorded here so the discrepancy in the requirement's wording isn't mistaken for a fourth route existing.
- **Proposed threshold (now confirmed):** UI-NFR-2's WCAG AA contrast numbers (4.5:1 / 3:1) were proposed by the maker, not originally given by the user (the confirmed `thresholds` answer was "none known"). The user subsequently confirmed this explicitly as a tracked, must-priority requirement via the `contrast-target` question. Recorded here for transparency about its origin.
- **Self-reported frequency:** [[prob-1]]'s "who is affected" answer ("roughly daily or weekly") is the user's own estimate, not a measured usage count — there is no telemetry in this app. This is already flagged as an estimate in the problem brief and is carried forward here rather than treated as a hard number.
- **Subjective success metric:** [[prob-1]]'s success metric ("I actually want to open the app") is behavioral/subjective and cannot be measured at delivery time; the operational proxy used throughout this baseline is that every screen visibly matches the agreed design tokens, confirmed by direct review rather than an automated metric.
- No other quality-attribute categories (performance, availability, security, privacy, usability beyond the above, maintainability beyond UI-NFR-1, portability, scalability, observability, compliance) were found to apply — the confirmed `compliance` answer was "none" and the confirmed `actors`/`constraints` answers ruled out load, multi-user, or regulatory concerns for this personal, single-user app.
