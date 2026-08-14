# Solution Concept: Budget Planner UI Design

## Options considered

### Option 1: Do nothing (baseline)

Leave the four screens as unstyled semantic HTML, exactly as they are today.

### Option 2: Native CSS Modules + design tokens

A global stylesheet (`app/globals.css`) imported once in `app/layout.tsx`,
defining design tokens as CSS custom properties (color palette, spacing
scale, type scale, radii). Each screen/component gets its own
`ComponentName.module.css` for layout and structure specific to it, drawing
on the shared tokens. Both mechanisms are built into Next.js's bundler
already — no new dependency, no new config file.

### Option 3: Tailwind CSS

Add `tailwindcss` as a dev dependency, generate a `tailwind.config` and
PostCSS config, and restyle the four screens using utility classes directly
in JSX.

## Chosen approach

Option 2: native CSS Modules + design tokens.

Concretely: a `app/globals.css` stylesheet holding CSS custom properties for
the design tokens (a small color palette, a type scale of 3-4 sizes, a
spacing scale, base typography for `body`/headings), imported once from
`app/layout.tsx`. Each of the four screens (`app/page.tsx`,
`app/budget/page.tsx`, `app/receipts/page.tsx`,
`app/receipts/LineItemCategoryEditor.tsx`) gets a colocated
`.module.css` file for its own layout, applying the shared tokens rather than
hardcoding new values. `app/layout.tsx` gains a small shared shell (e.g. a
page wrapper and simple heading/nav treatment) so the four screens read as
one app rather than four disconnected pages. No new npm dependency is added.
Specific token values (exact palette, type scale) and file-by-file layout are
requirements/design work for the next stage, not decided here.

## Why not the alternatives

**Do nothing** was rejected because it does not address the problem stated
in [[prob-1]] — the unstyled look is what drives the risk of abandoning the
app ([[prob-1]] Cost of inaction). Including it here only confirms that
inaction has a real cost, not that some styling effort is unwarranted.

**Tailwind** was rejected not on capability — it can produce the same visual
result — but on cost relative to the stated appetite and maintainer profile.
[[prob-1]] and the concept-stage answers establish this is a "few days"
effort maintained solo, with no existing tooling investment either way.
Tailwind would add a runtime/build dependency, a config file, and a second
authoring convention (utility classes in JSX) to learn and keep working
across Next.js upgrades — overhead a 4-screen personal project does not need
to take on when the built-in mechanism does the same job. It remains a
reasonable choice in the abstract; it lost specifically against "adds zero
new dependencies" when nothing else favored it strongly enough to justify
that cost.

## Constraints

No constraints were named beyond an open choice (from the answer to
`constraints`: "None — open choice... pick whatever is simplest to maintain
long-term for a solo personal project"). The appetite is "a few days" (from
the answer to `appetite`). The codebase itself constrains the field of cheap
options: Next.js App Router supports global CSS and CSS Modules with zero
added dependencies or config, which is why those two mechanisms specifically
were on the table (from the `existing-architecture` research).

## Assumptions

- The four screens read by `existing-architecture` research
  (`app/page.tsx`, `app/budget/page.tsx`, `app/receipts/page.tsx`,
  `app/receipts/LineItemCategoryEditor.tsx`) are the complete current UI
  surface — *cheap to check now*, and already checked once via `Glob` in
  triage, finding exactly these four files.
- `LineItemCategoryEditor.tsx` is a client component (it is described as an
  "editor," implying interactivity) — *cheap to check now*, not yet
  confirmed by reading the file's `"use client"` directive; should be
  verified in the requirements/design stage since it affects whether any
  interactive states (hover, focus, error) need designing.
- CSS Modules will compose cleanly with whatever data/markup structure each
  server component already renders, without requiring markup restructuring
  beyond adding `className` attributes — *only discoverable later*, once
  each screen is actually restyled.

## Risks

- A shared token set designed up front might not fit one of the four screens
  well (e.g. the line-item editor's denser, form-like layout vs. the budget
  summary's sparser, text-heavy layout) — shows up early, the moment that
  screen is styled, and is cheap to adjust since nothing here is a stored
  schema.
- Because reversibility was rated high ([[prob-1]] confirms this is a
  personal, low-stakes app), the main risk is under-polish rather than
  lock-in: a "few days" appetite could produce something only marginally
  better than today, which would not move the success signal in [[prob-1]]
  (wanting to open the app willingly). This should be checked against actual
  screenshots before calling the work done, not just against the presence of
  a stylesheet.

## Out of scope

Carried forward from [[prob-1]]: no changes to receipt parsing,
categorization, budget calculation, statistics, position-matching, goals,
security/encryption, or the mocked/in-memory backend.

Newly excluded by this choice: adopting any CSS framework, component
library, or CSS-in-JS tooling (Tailwind, styled-components, MUI, Chakra,
etc.) — the chosen direction is plain CSS Modules only. Also excluded:
building a reusable component library intended for reuse beyond this app's
four screens, and any dark-mode/theming system beyond the single palette
defined by the tokens (not requested, not implied by the appetite).
