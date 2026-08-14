# Problem Brief: Budget Planner UI Design

## Problem

Budget Planner's screens (home, receipts list/upload, line-item category
editor, monthly budget summary) render as bare, unstyled semantic HTML — no
colors, typography, spacing system, or layout design has ever been applied —
and that look is unpleasant enough that the person who uses the app avoids
opening it.

## Who is affected

Just the one person who uses this app (from the answer to `who-is-affected`)
— it is a personal budget tool with a single hardcoded user
(`CURRENT_USER_ID`, no multi-user auth exists in the codebase). They estimate
opening it "roughly daily or weekly" when logging receipts or checking the
budget summary — their own estimate, not a measured count.

## Evidence

The user's own account (from the answer to `evidence`): the current look is
unpleasant enough that they avoid using the app. This is corroborated by
direct inspection of the code: `app/budget/page.tsx` and the other three
screens render as plain `<main>`/`<h1>`/`<p>` tags with no `className` usage
and no style imports anywhere in the codebase — there is no CSS file, design
token, or styling dependency in `package.json`. No usage log, metric, or
external report exists; the evidence is the user's self-report plus the
directly-observed state of the code, not an instrumented measurement.

## Cost of inaction

Per the answer to `cost-of-inaction`: a real risk of abandoning the app
entirely — the user states that continued neglect of the visual design risks
them stopping use of the app altogether and reverting to a spreadsheet or no
tracking at all. This is the user's own stated assessment, not a projection
from usage data (none exists).

## Success metrics

Per the answer to `success-signal`, the target is behavioral and subjective:
the user wants to open the app willingly rather than avoid it. There is no
usage telemetry in this app, so that cannot be measured with an existing
number today. The operational proxy usable at delivery time is: every
existing screen (home, receipts, line-item editor, budget summary) visibly
matches an agreed, cohesive visual design (consistent colors, typography,
spacing, layout), confirmed by the user's direct review of the rendered
screens. Whether it actually changes behavior — does the user open the app
more often afterward — is not measurable at delivery time; it would require
usage instrumentation that does not exist yet.

## Out of scope

Business logic, features, and backend/infrastructure (from the answer to
`out-of-scope`): no changes to receipt parsing, categorization, budget
calculation, statistics, position-matching, goals, security/encryption, or
the mocked/in-memory backend. Concretely, this excludes something a
reasonable person might otherwise fold into "redesign the UI": any bugs or
rough edges noticed in budget math, categorization, or other logic while
touching these screens are explicitly not to be fixed as part of this piece
of work — they would need their own separate change.

## Assumptions

- The four existing screens (home, receipts, line-item editor, budget
  summary) are the complete current screen set — no other routes exist
  under `app/` today.
- A styling approach needs to be chosen (e.g. plain CSS, CSS Modules) since
  no styling framework is currently installed; this decision belongs to the
  Concept stage.
- "Mockup" per the original request may mean either directly restyling the
  real pages, or producing a separate prototype first — to be resolved in
  Concept.
- No usage/analytics instrumentation exists in the app, so the success
  signal in this brief will be judged by the user's own reaction to the
  finished screens rather than a measured behavior change.

## Open questions

None blocking. The Concept stage should resolve the styling-approach and
mockup-delivery-mechanism assumptions above.
