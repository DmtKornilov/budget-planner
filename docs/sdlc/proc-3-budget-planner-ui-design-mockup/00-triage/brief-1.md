# Change Brief: Budget Planner UI Design Mockup

## What changes

The app's existing screens (home, receipts list/upload, line-item category
editor, monthly budget summary) currently render as bare, unstyled semantic
HTML with no visual design applied. When this is done, all of these screens
will share a cohesive visual design — consistent colors, typography, spacing,
and layout — while their existing functionality and data remain exactly as
they are today. This may be delivered as a styled mockup/prototype first and
then applied to the real pages.

## Kind of change

feature

## Why this kind

Establishing a visual design system from scratch (no colors, typography,
spacing, or component styling exist anywhere in the repository today) and
applying it consistently across four distinct screens with different content
shapes (list view, form/editor, summary view, landing page) is a set of real
design decisions, not a bounded one-line correction. It is new *product*
behavior — the product goes from having no visual design to having one — even
though it changes no business logic.

The case against: the change touches zero business logic, zero public
interfaces, and impact analysis confirmed a zero/LOW blast radius
(`mcp__meridian__impact` on `BudgetPage`, direction=upstream, returned
`impactedCount: 0`, `risk: LOW`). By that narrow code-blast-radius measure
alone it could be argued as a chore. This brief weights the design-decision
surface (palette, type scale, layout system, component states, and how they
apply across four different screen types) over the code blast radius, because
the risk this process protects against here is an incoherent, half-designed
product, not a broken caller.

## Expected blast radius

Presentation-layer only. No exported types, public APIs, stored schema, or
serialized format is touched.

Files expected to change:
- `app/page.tsx` — home page
- `app/budget/page.tsx` (`BudgetPage`) — monthly budget summary screen
- `app/receipts/page.tsx` — receipts list/upload screen
- `app/receipts/LineItemCategoryEditor.tsx` — line-item category editor
- `app/layout.tsx` — root layout, to load shared stylesheet/design tokens

New files expected: a global stylesheet and/or CSS module(s) — none exist
today. `package.json` lists only `next`, `react`, `react-dom` as dependencies;
no Tailwind, CSS-in-JS, or component library is installed.

Impact analysis (`mcp__meridian__impact`, `direction: upstream`) on
`BudgetPage`: `impactedCount: 0`, `risk: LOW`, 0 affected processes, 0
affected modules — a leaf Next.js route component with no callers. The other
three page/editor components are the same shape (top-level route components
or a component rendered only by its parent page), so the same profile is
expected to apply.

No prior UI design attempt was found in the repository: `docs/sdlc/**` (179
files across `proc-1` and `proc-2`) covers only backend/logic requirements
(receipt digitization, categorization, budget calculation, statistics,
position-matching, goals, security), delivered as bare, unstyled pages
(confirmed by reading `app/budget/page.tsx`: plain `<main>`/`<h1>`/`<p>` tags,
no `className` usage, no style imports). No CSS files, design tokens, or
styling dependency exist. This is a clean-slate visual design effort.

## Acceptance criteria

- Every existing screen (home, receipts list/upload, line-item category
  editor, monthly budget summary) is visibly restyled with a shared, defined
  visual language (consistent color palette, typography scale, spacing
  system, and layout conventions) rather than unstyled browser-default HTML.
- The existing functional behavior and data displayed on each screen are
  unchanged — this is a visual-only change, verified by the existing test
  suite continuing to pass (109+ tests across `lib/**` and `app/api/**`
  currently unaffected, since none of them touch presentation files).
- The design is applied consistently: shared elements (headings, buttons,
  form controls, status/warning text such as the "incomplete" budget label
  and "excluded pending review" notice) look and behave the same wherever
  they appear across screens.
- A visual design reference (mockup) exists that a reviewer can look at to
  judge whether a given screen matches the intended design — either the
  restyled pages themselves, and/or a dedicated mockup artifact, per what
  the Concept/Requirements stages decide.

## Out of scope

- Any change to business logic: receipt parsing/digitization, categorization
  rules, budget calculation, statistics, position-matching, goals, or
  security/encryption code under `lib/**` and `app/api/**`.
- New functional capabilities (new screens, new user actions, new data shown
  that isn't already shown today).
- A component library or design system intended for reuse outside this app
  (e.g. publishing to a package registry) — scope is this app's own screens.
- Accessibility audit beyond baseline semantic HTML already in place, unless
  raised as a requirement in a later stage.
- Backend/infrastructure work — per project memory, this remains a mocked/
  in-memory app; this change does not touch that.

## Open questions

None blocking triage. The Concept stage should confirm: (1) whether the
mockup is delivered as directly-restyled real pages vs. a separate prototype
route, and (2) any brand/style preferences (color palette, tone) the user
wants reflected, if they have specific preferences beyond "cohesive and
professional."
