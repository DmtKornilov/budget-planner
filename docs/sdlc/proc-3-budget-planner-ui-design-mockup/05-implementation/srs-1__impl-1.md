## Summary

Implements the full requirements baseline (srs-1): a shared design-token stylesheet (`app/globals.css`), a shared page shell in the root layout, and per-screen CSS Modules styling for all four screens (home, receipts list, budget summary, line-item category editor), including their existing empty states and error state. No business logic, data shape, or component behavior was changed — only `className` attributes and new `.module.css` / `globals.css` files were added. Verified: `npm run build` succeeds (TypeScript + Next.js production build), `npm test` passes 121/121 with zero modified test files, and the WCAG contrast tokens were checked computationally (all pairings score 5.98:1–15.52:1, comfortably above the 4.5:1/3:1 thresholds in UI-NFR-2).

## Requirements implemented

- [[prob-1/concept-1/req-1]] — `app/globals.css`: `:root` design tokens (color palette, typography scale, spacing scale) referenced by every other stylesheet added in this change.
- [[prob-1/concept-1/req-2]] — `app/page.tsx` + `app/page.module.css`: home screen heading, description, and nav links styled.
- [[prob-1/concept-1/req-3]] — `app/receipts/page.tsx` + `app/receipts/page.module.css`: receipt sections and line-item table styled, including the manual-review suffix (`.manualReview`).
- [[prob-1/concept-1/req-4]] — `app/budget/page.tsx` + `app/budget/page.module.css`: total, incomplete-month indicator (`.incomplete`), and excluded-count message styled.
- [[prob-1/concept-1/req-5]] — `app/receipts/LineItemCategoryEditor.tsx` + `app/receipts/LineItemCategoryEditor.module.css`: category `<select>` styled in both enabled and disabled/pending states.
- [[prob-1/concept-1/req-6]] — `app/receipts/page.module.css` `.empty` class applied to the existing "No receipts yet..." message.
- [[prob-1/concept-1/req-7]] — `app/budget/page.module.css` `.empty` class applied to the existing "No receipts recorded for this month yet." message.
- [[prob-1/concept-1/req-8]] — `app/receipts/LineItemCategoryEditor.module.css` `.error` class applied to the existing inline error message.
- [[prob-1/concept-1/req-9]] — no logic changed in any of the five files; verified via the unmodified `npm test` suite (121/121 passing, same as before this change) and by preserving every conditional branch, prop, and API call exactly as it was.
- [[prob-1/concept-1/req-10]] — `app/layout.tsx` + `app/layout.module.css`: shared page wrapper (`.shell`) and header/nav treatment (`.header`, `.nav`, `.navLink`) added to the root layout, wrapping all screens including the receipts page (and therefore the embedded category editor, which inherits it rather than getting a separate shell).
- [[prob-1/concept-1/qa-1]] — no new npm dependency added; `package.json` unchanged (verified by inspection).
- [[prob-1/concept-1/qa-2]] — contrast verified computationally in the browser against the final token values: text/bg 15.52:1, text-secondary/bg 5.98:1, accent/bg 6.70:1, warning-text/bg 7.09:1, error-text/bg 6.57:1 — all above the 4.5:1 (normal text) / 3:1 (large text) thresholds.

## Symbols changed

- `RootLayout` (app/layout.tsx) — added `globals.css` import and a shared shell wrapper (header, brand link, nav) around `children`.
- `HomePage` (app/page.tsx) — added `className` attributes from `page.module.css`.
- `ReceiptsPage` (app/receipts/page.tsx) — added `className` attributes from `page.module.css`; wrapped the manual-review suffix in a styled `<span>`.
- `LineItemCategoryEditor` (app/receipts/LineItemCategoryEditor.tsx) — added `className` attributes from `LineItemCategoryEditor.module.css` to the `<select>` and the error `<span>`.
- `BudgetPage` (app/budget/page.tsx) — added `className` attributes from `page.module.css`; wrapped the non-empty state in a `.card` div.

New files (no existing symbols): `app/globals.css`, `app/layout.module.css`, `app/page.module.css`, `app/receipts/page.module.css`, `app/receipts/LineItemCategoryEditor.module.css`, `app/budget/page.module.css`.

## Design notes

- Considered removing the home screen's own nav list now that the root layout carries a shared header nav, but kept both: the header nav satisfies req-10's cross-screen consistency, while the home page's nav list is page content (styled as clickable cards) rather than duplicate chrome — a common landing-page pattern, and removing existing markup wasn't requested or required.
- Kept the manual-review suffix's exact existing text (" (requires manual review)", parentheses included) rather than restyling it as a bare badge label, to avoid any wording change beyond what req-9 (preserve existing behavior) and the req-3 acceptance scenario ("the '(requires manual review)' suffix is styled") called for.
- Used semantic warning/error color tokens (`--color-warning-text`/`bg`, `--color-error-text`/`bg`) distinct from the general text/accent tokens so the manual-review badge and the save-failure alert read as visually distinct states, per the req-3 and req-8 acceptance scenarios.
- Did not address table overflow on very narrow (sub-400px) viewports — the confirmed `actors` answer scoped this to desktop browser use only, so no responsive/mobile layout work was done. See Risks.

## Risks

- The receipts table's category cell (existing text plus the `<select>`) can overflow the viewport on narrow widths (observed at ~390px in browser testing) — not fixed, since the confirmed `actors` answer for this piece of work is "just me, via a desktop browser," and mobile support was never in scope. Flagging in case usage patterns change later.
- Visual verification was done via `get_page_text`, computed contrast values, and one successful screenshot (before the Browser pane stopped rendering mid-session); a full screenshot pass across all three screens with populated data was not possible in this session. The underlying JSX/CSS changes are small, mechanical (adding `className` attributes and new stylesheets, no logic changes), and covered by the passing build and unmodified test suite, but a manual look at all screens before calling this fully done is still worth doing.
- A single receipt was POSTed to the dev server's in-memory store (`Sample Merchant`, via the existing mock OCR fixture) purely to visually verify the populated table state; it lives only in that dev server process's memory and has no effect on the codebase, tests, or any persisted data.
