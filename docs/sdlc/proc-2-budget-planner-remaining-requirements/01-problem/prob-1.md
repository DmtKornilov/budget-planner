
# Problem Brief — Budget Planner (Remaining Requirements)

## Problem

Individual users who want to understand and control their personal spending currently have no low-effort way to get item-level visibility into what they actually buy. Manually logging every purchase is tedious enough that people abandon the habit, and bank/card transaction feeds only show a merchant name and a total, not what was actually purchased — so a user cannot tell whether a charge was groceries, alcohol, or household goods. This is the same problem framed in this repository's prior SDLC process (proc-1, `docs/sdlc/proc-1-budget-planner-v1/01-problem/prob-1.md`), not a new one: proc-1 relieved only part of it — a user can now turn a receipt photo into structured data — but still cannot see where that spending sits relative to everything else, whether it fits within what they can afford this month, or whether they are moving toward or away from something they care about financially. The underlying difficulty — lacking the detail and context needed to understand or act on where money goes — remains largely unrelieved.

## Who is affected

General consumers, broad market — any individual who wants visibility into their own personal spending. Not scoped to a narrower cohort, region, or pilot group, consistent with the source BRD's framing (Section 5, "End user"). No count or frequency is available for how many people currently run into this or how often — that data does not exist yet (see Evidence). (from the answer to `who-is-affected`, confirmed same as proc-1)

## Evidence

No evidence yet — this remains a hypothesis, not a validated problem. There is no support-ticket data, user research, interview, or usage metric behind it. The case rests entirely on reasoning in the source BRD (Section 3): that manual expense tracking has a known adoption problem, and that bank/card feeds lack item-level purchase detail. Both claims are asserted in the BRD, not sourced to an external study or internal data. (from the answer to `evidence`, confirmed same as proc-1)

## Cost of inaction

Not urgent, no hard deadline. If nobody builds this for six months, nothing specific breaks or is lost — there is no committed date, contractual obligation, or active fire driving this. This is a proactive bet on building a budgeting product, not a response to an existing loss. Note that proc-1's slice (digitization only) is already shipped and usable in isolation, so inaction here specifically means: users can digitize receipts but get no budget insight from doing so. (from the answer to `cost-of-inaction`, confirmed same as proc-1)

## Success metrics

- **Adoption**: the count/share of users who upload at least one receipt. Requires usage instrumentation that does not exist yet — not measurable today.
- **Goal engagement** (primary signal for v1, per the answer to `success-signal`): the share of users who set at least one goal. Same instrumentation gap: not measurable until the product and its event logging exist. This process is what makes goal engagement possible to even attempt, since proc-1 did not build any goal-setting capability.
- No numeric thresholds are attached to either metric — no target value for adoption share or upload frequency was given, and none is invented here (see Open Questions, carried from proc-1).
- The BRD (Section 12) also lists four other indicative metrics marked "to be finalized with stakeholders": receipt parsing accuracy, manual review rate, categorization accuracy, and retention impact. None has a set target value; none is treated as measurable today.

## Out of scope

Per the source BRD (Section 4.2), confirmed as correct for this process (same as proc-1's exclusions) — named specifically because a reasonable person building "a budgeting app" would likely assume some of these were included:
- Direct integration with bank accounts or card transaction feeds — a reasonable default for most budgeting products, explicitly excluded here.
- Multi-currency conversion (single-currency per user account; currency is configurable, but no conversion) — also a reasonable default assumption this excludes.
- Shared/household budgets across multiple user accounts.
- Automated bill payment or execution of any financial transaction — the product advises, it does not act on the user's finances.
- Tax filing or tax-advice functionality.

Additionally out of scope for this specific process: work already delivered by proc-1 (receipt format validation/rejection and structured extraction) is not being redone or re-litigated here — it is an input this process builds on. (from the answer to `out-of-scope`)

## Assumptions

- Everything proc-1's problem brief assumed still holds: users have a device capable of taking a legible receipt photo; users operate in a single home currency per account; receipts are itemized; a default category taxonomy will be provided by the business (this process's categorization work depends on this); confidence thresholds for OCR/categorization/manual-review are not yet numerically defined (BRD Open Question 5) and remain an open configuration decision this process inherits rather than resolves.
- The "no evidence yet" status of this problem is accepted as a starting hypothesis to continue building against, not a blocker — consistent with how proc-1 proceeded.
- proc-1's delivered slice (digitization, mocked OCR provider, in-memory receipt store) is a stable enough foundation to extend; this process assumes no rework of that slice is required before adding the remaining capability.

## Open questions

Carried forward unresolved from proc-1's problem brief (all still apply, and several become directly load-bearing for requirements this process will write):
1. What are the target values for the success metrics in BRD Section 12?
2. Which markets/currencies must be supported at launch — is multi-currency truly out of scope?
3. Should household/shared budgets be considered for a future phase?
4. What is the tolerance for advice generated from limited data (directly relevant to this process's goal-advice requirements)?
5. What confidence threshold values should be used for OCR fields, category assignment, and manual-review triggers (directly relevant to this process's categorization and confidence-flagging requirements)?
6. Should budget periods be strictly calendar months, or should custom billing cycles be supported (directly relevant to this process's budget-calculation requirements)?

No new open questions were raised while sharpening this brief — the scope is fully bounded by proc-1's existing requirements baseline (`docs/sdlc/proc-1-budget-planner-v1/srs-1/baseline.md`), which already enumerates the 24 remaining requirements this process addresses.
