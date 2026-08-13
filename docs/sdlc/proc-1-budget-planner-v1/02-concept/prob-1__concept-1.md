# Solution Concept — Budget Planner

Derived from [[prob-1]], the approved problem brief: users lack low-effort, item-level visibility into their spending (see [[prob-1]] `## Problem`), and no product exists yet to provide it.

## Options considered

### Option 1 — Full-stack JS
Next.js/React frontend + Node backend in one language, Postgres on a cheap hosted tier (e.g. Supabase/Neon), a hosted OCR API for receipt parsing, and an LLM API (e.g. Claude) for categorization and goal-based advice. Deployed on a low-cost PaaS (Vercel + Supabase-style free/cheap tiers).

- **Cost against appetite** (~2 weeks, per the answer to `appetite`): fits — one language end-to-end means less context-switching for a solo build, and hosted OCR/LLM APIs mean no model training or infra to stand up.
- **Gives up**: control over OCR/LLM cost per receipt (paying per-API-call rather than running something self-hosted); some flexibility a split-stack setup might offer.
- **Changing your mind later**: cheap. Frontend, backend, and data layer are ordinary swappable components; the OCR/LLM provider is called via API, not baked into the data model, so switching providers later is a config change, not a rewrite.

### Option 2 — Python backend + simple frontend
FastAPI backend, lightweight frontend (React or server-rendered), Postgres, OCR via a hosted API or Tesseract for lower cost, LLM API for categorization/advice.

- **Cost against appetite**: roughly comparable to Option 1 in raw effort, but introduces a second language boundary (Python backend / JS frontend) to design and maintain, which costs more coordination time for a ~2-week solo build than Option 1.
- **Gives up**: the single-language simplicity of Option 1; in exchange gains nothing this project specifically needs, since no existing Python assets or team Python preference were named (see `## Constraints`).
- **Changing your mind later**: similar reversibility to Option 1 — same swappable-component structure, just in two languages instead of one.

### Option 3 — No-code/low-code prototype
Assemble from an app/form builder, an Airtable-style database, automation glue, and an OCR API, instead of writing custom backend code.

- **Cost against appetite**: cheapest and fastest to get something clickable — could produce a demo in days, not weeks.
- **Gives up**: the ability to implement the BRD's actual differentiators cleanly — multi-photo position-matching (BR-2), learned category corrections (BR-3 C5), and goal-based recommendation logic (BR-6) all need custom logic that no-code platforms handle awkwardly or not at all. Likely to be rebuilt as custom code almost immediately after the demo stage.
- **Changing your mind later**: poor. No-code platforms tend to lock data and logic into their own model; migrating out later is closer to a rewrite than a refactor.

### Option 4 — Do nothing custom (baseline)
Don't build software. Point users at an existing budgeting app (e.g. YNAB) plus a generic receipt-scanning app, and accept the gap.

- **Cost against appetite**: zero build cost.
- **Gives up**: the entire value proposition in [[prob-1]] `## Problem` — item-level visibility tied to a user's own goals is exactly what off-the-shelf tools don't do (that's the stated problem). This option doesn't solve the problem; it's the baseline every other option is measured against.
- **Changing your mind later**: N/A — nothing is built to reverse.

## Chosen approach

Option 1, Full-stack JS: confirmed by the user (see the answer to `chosen-direction`).

- **Frontend**: Next.js/React, single web app (not native mobile) — receipt photo upload from a phone browser, category/budget views, goal setup.
- **Backend**: Node.js API layer, same repo/language as the frontend.
- **Data**: Postgres on a cheap hosted provider, modeled around the entities the BRD's Section 9 already sketches (User, Receipt, LineItem, Category, PositionMatch, MonthlySnapshot, Recommendation) — exact schema is a design-stage decision, not fixed here.
- **Receipt parsing**: a hosted OCR API, called per uploaded photo.
- **Categorization + advice**: an LLM API (e.g. Claude) for classifying line items and generating goal-based recommendations, per BR-3 and BR-6.
- **Deployment**: a low-cost PaaS (e.g. Vercel for the app, a managed Postgres tier for the database) — no self-managed infrastructure.

This directly addresses [[prob-1]] `## Problem` (item-level visibility) and `## Success metrics` (adoption + goal engagement are both features of this app, not of a third-party tool).

## Why not the alternatives

- **Option 2 (Python backend)** was not chosen because it costs more coordination overhead (two languages instead of one) for a solo ~2-week build, without buying anything this project needs — no existing Python codebase, team preference, or library requirement was named.
- **Option 3 (no-code)** was not chosen because it cannot cleanly implement the item-level logic that is the actual differentiator of this product (BR-2 position-matching, BR-3 learned corrections, BR-6 goal-based advice) — it would likely need to be rebuilt as custom code shortly after a demo, making it slower overall despite being faster at first.
- **Option 4 (do nothing)** was not chosen because it does not solve the stated problem at all — it was included as the required baseline, not a real contender.

## Constraints

- No required tech stack — the user stated "I don't know what tech stack to use. I want it cheap and working" (answer to `constraints`), so the concept stage proposed a specific one rather than leaving it open.
- Cost-sensitive: the core loop depends on paid OCR and LLM API calls per receipt, so per-call cost is a live concern for the design stage, not fully resolved here (answer to `constraints`).
- Appetite is ~2 weeks for an MVP covering BR-1 through BR-6 with basic UI (answer to `appetite`).
- No existing codebase, data model, or deployment shape constrains the choice — confirmed greenfield (answer to `existing-architecture`).

## Assumptions

- A hosted OCR API can hit the BRD's informal "under 10 seconds" parsing target (N4) at acceptable per-receipt cost — *only discoverable later*, once a specific provider is priced and benchmarked against real receipt photos.
- An LLM API is suitable for both categorization (BR-3) and goal-based advice generation (BR-6) without needing a separately trained/fine-tuned model — *cheap to check now*, by prototyping a few categorization calls against sample receipt data before committing.
- A single Postgres instance on a cheap hosted tier is sufficient for an MVP's data volume (one user's or a small number of users' receipts) — *cheap to check now*, it's a standard assumption for any early-stage product and doesn't need dedicated validation.
- Web-only (no native mobile app) is acceptable for photo upload via phone browser camera access — *cheap to check now*, by confirming phone browsers can access the camera for upload, which is standard.
- "Cheap" (per the constraints answer) has no specific budget ceiling attached — *only discoverable later*, since no number was given; the design stage should pick specific providers with visible, low per-unit pricing rather than assume a budget that was never stated.

## Risks

- **OCR/LLM cost per receipt turns out higher than expected** — could make "cheap" infeasible at any real usage volume. Early signal: price out 2-3 providers and estimate cost per receipt before writing backend code.
- **OCR accuracy on real (not ideal) receipt photos is poor** — could push most receipts into [[prob-1]]'s manual-review path, undermining the whole automation premise. Early signal: test the chosen OCR API against a handful of real, imperfect receipt photos before building the rest of the pipeline around it.
- **Two-week appetite is optimistic for a solo build covering BR-1 through BR-6** — could result in a rushed or partial MVP. Early signal: if BR-1 (digitization) and BR-3 (categorization) alone are not working cleanly by the end of week 1, BR-6 (advice) is at risk and scope should be cut, not schedule stretched silently.
- **No evidence yet that the underlying problem is real** (per [[prob-1]] `## Evidence`) — the whole build is a bet on an unvalidated hypothesis. Early signal: this doesn't change during the concept/requirements stages, but should be revisited before any spend beyond the MVP.

## Out of scope

Carried forward from [[prob-1]] `## Out of scope`: no bank/card integration, no multi-currency conversion, no shared/household budgets, no automated bill payment, no tax filing/advice.

Newly excluded by this choice of approach:
- Native mobile apps (iOS/Android) — web-only for the MVP; camera access via phone browser is assumed sufficient (see `## Assumptions`).
- Self-hosted/custom-trained OCR or ML models — the MVP uses hosted third-party APIs rather than building or training its own models.
- Multi-region or high-availability infrastructure — a single low-cost PaaS deployment is in scope; scaling/redundancy work is not.
