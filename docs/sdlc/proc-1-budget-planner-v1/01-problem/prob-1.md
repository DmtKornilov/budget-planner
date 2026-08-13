# Problem Brief — Budget Planner

## Problem

Individual users who want to understand and control their personal spending currently have no low-effort way to get item-level visibility into what they actually buy. Manually logging every purchase is tedious enough that people abandon the habit, and bank/card transaction feeds only show a merchant name and a total (e.g. "Fresh Market — 84.50 PLN"), not what was actually purchased — so a user cannot tell whether that charge was groceries, alcohol, or household goods. As a result, users lack the detail needed to understand where their money goes or to act on it.

## Who is affected

General consumers, broad market — any individual who wants visibility into their own personal spending. This is not scoped to a narrower initial cohort, a specific region, or a personal/self-use pilot; the intended audience is the general population of people trying to track spending, as framed in the source BRD (Section 5, "End user"). No count or frequency is available for how many people currently run into this or how often — that number does not exist yet (see Evidence).

## Evidence

No evidence yet — this is a hypothesis, not a validated problem. There is no support-ticket data, user research, interview, or usage metric behind it. The case currently rests entirely on reasoning laid out in the source BRD (Section 3): that manual expense tracking has a known adoption problem, and that bank/card feeds lack item-level purchase detail. Both of those claims are asserted in the BRD, not sourced to an external study or internal data. (from the answer to `evidence`)

## Cost of inaction

Not urgent, no hard deadline. If nobody builds this for six months, nothing specific breaks or is lost — there is no committed date, contractual obligation, or active fire driving this. This is a proactive bet on building a differentiated, engaging budgeting product, not a response to an existing loss. (from the answer to `cost-of-inaction`)

## Success metrics

- **Adoption**: the count/share of users who upload at least one receipt. Measurable today only in the trivial sense of "zero," since no product exists yet — this requires usage instrumentation that does not exist yet, to be built alongside the product.
- **Goal engagement** (primary signal for v1, per the answer to `success-signal`): the share of users who set at least one goal. Same instrumentation gap as above: not measurable until the product and its event logging exist.
- Two words in the original phrasing of this metric were doing unsupported work and have been removed rather than kept vague: "meaningful" (share) and "regularly" (upload frequency). No threshold for either was given, and none is invented here — see Open Questions.
- The BRD (Section 12) also lists four other indicative metrics whose target values are explicitly marked "to be finalized with stakeholders": receipt parsing accuracy, manual review rate, categorization accuracy, and retention impact (active usage among users who receive goal-based advice vs. those who don't). These are not yet measurable commitments.

## Out of scope

Per the source BRD (Section 4.2), confirmed as correct for this phase. Called out specifically because a reasonable person building "a budgeting app" would likely assume these were included:
- Direct integration with bank accounts or card transaction feeds — a reasonable default for most budgeting products, explicitly excluded here.
- Multi-currency conversion (single-currency per user account; currency is configurable, but no conversion) — also a reasonable default assumption this excludes.
- Shared/household budgets across multiple user accounts.
- Automated bill payment or execution of any financial transaction — the product advises, it does not act on the user's finances.
- Tax filing or tax-advice functionality.

## Assumptions

- Users have a smartphone or device capable of taking a legible receipt photo (BRD Section 10).
- Users operate in a single home currency per account (BRD Section 10).
- Receipts are itemized (list individual purchased items) — item-level categorization, position-matching, and item-based advice all depend on this holding true; a receipt with only a total defeats the core value proposition.
- A default spending category taxonomy will be provided by the business before development, with users able to extend it (BRD Section 10).
- OCR/categorization/manual-review confidence thresholds are not yet defined and will need to be set during design (BRD Section 10 and Open Question 5 below).
- "General consumers, broad market" as the target audience is taken at face value; no market or persona prioritization has been done yet.
- The "no evidence yet" status of this problem (see Evidence) is accepted as a starting hypothesis to validate, not a blocker to beginning requirements work.
- No specific threshold exists yet for what counts as a "meaningful" adoption share or a "regular" upload cadence — these were in the original success-signal answer without a number attached, and none has been supplied since.

## Open questions

Carried forward from the source BRD (Section 14), still unresolved:
1. What are the target values for the success metrics in BRD Section 12 (e.g. acceptable manual-review rate)?
2. Which markets/currencies must be supported at launch — is multi-currency truly out of scope for phase 1?
3. Should household/shared budgets be considered for a future phase?
4. What is the tolerance for advice based on limited data (BRD requirement F5) — soft low-confidence suggestions, or withhold advice entirely?
5. What confidence threshold values should be used for OCR fields, category assignment, and manual-review triggers?
6. Should budget periods be strictly calendar months, or should custom billing cycles be supported?

Additional questions raised while sharpening this brief:
7. What specific upload frequency counts as "regular" usage, and what share of active users counts as "meaningful" adoption, for the Adoption/Goal engagement success metrics above? No number was given; one is needed before those metrics are actionable.
8. Since there is no validating evidence yet (see Evidence section), should the requirements stage proceed as a hypothesis-driven build, or should some lightweight validation (e.g. a small user survey) happen first?
