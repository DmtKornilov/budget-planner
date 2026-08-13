## Summary

Scaffolded the Next.js/TypeScript project from nothing (package.json, tsconfig, Next config, App Router shell) per the approved concept ([[prob-1/concept-1]]), and implemented the first thin vertical slice of the receipt digitization service: format validation and rejection, structured-data extraction, and persistence. This intentionally covers only 4 of the 20 must-have requirements — the user chose this scope explicitly ("thin vertical slice first") over scaffold-only or all-must-haves-at-once, to prove the pipeline shape end-to-end before wiring real OCR/LLM providers and a real database. Low-confidence flagging (req-4), manual-review routing (req-5), categorization (BR-3), and budget calculation (BR-4) are not yet implemented.

## Requirements implemented

- [[prob-1/concept-1/req-1]] — `validateFormat()` in `lib/receipts/validateFormat.ts` accepts JPEG/PNG/HEIC/PDF-scan MIME types before any processing occurs.
- [[prob-1/concept-1/req-2]] — the same `validateFormat()` throws `UnsupportedFormatError`, whose message names the accepted formats, for any other MIME type; the API route (`app/api/receipts/route.ts`) turns that into a 400 response.
- [[prob-1/concept-1/req-3]] — `parseReceipt()` in `lib/receipts/parseReceipt.ts` maps an `OcrResult` into merchant name, transaction date, transaction time, line items, and total amount.
- [[prob-1/concept-1/req-6]] — `InMemoryReceiptStore.save()` in `lib/receipts/receiptStore.ts` persists the extracted receipt with a fresh unique id per call, including recurring merchant/date/total combinations.

## Symbols changed

All new (greenfield build, confirmed empty blast radius during the plan step):
- `validateFormat`, `UnsupportedFormatError`, `SUPPORTED_FORMATS` — `lib/receipts/validateFormat.ts`
- `OcrProvider`, `OcrResult`, `OcrInput`, `MockOcrProvider` — `lib/receipts/ocrProvider.ts`
- `parseReceipt` — `lib/receipts/parseReceipt.ts`
- `ReceiptStore`, `InMemoryReceiptStore`, `NewReceipt` — `lib/receipts/receiptStore.ts`
- `digitizeReceipt`, `DigitizeReceiptInput` — `lib/receipts/digitizeReceipt.ts`
- `POST` (route handler) — `app/api/receipts/route.ts`
- `RootLayout`, `HomePage` — `app/layout.tsx`, `app/page.tsx`

## Design notes

- **OCR is mocked behind an `OcrProvider` interface**, not wired to a real hosted API. The approved concept names a hosted OCR API but no provider/credentials were specified or available, so `digitizeReceipt` takes the provider as a parameter (dependency injection) rather than hard-coding one — swapping in a real provider later means writing one class, not touching the orchestrator or its tests.
- **Persistence is an in-memory `Map`, not Postgres.** Same reasoning: the concept named Postgres, but standing up a real database wasn't necessary to prove req-1/2/3/6, and the concept was explicitly confirmed "mostly reversible" for exactly this kind of substitution. `ReceiptStore` is an interface for the same swap-later reason.
- **Considered and rejected:** wiring a real OCR API now. Rejected because no API key/provider choice was given, and guessing one would have meant inventing an external dependency the user never approved — safer to make the seam explicit and ask before spending a credential-requiring integration.
- **Considered and rejected:** implementing req-4/req-5 (confidence flagging, manual review) in this pass. Rejected to keep the slice thin per the user's explicit scope choice; the `parseReceipt` function currently assumes OCR succeeded with all fields present, which is a real gap tracked below, not an oversight.
- Chose Next.js 16.3.0 / React 19.2 / vitest 4.1.10 rather than the originally-scaffolded Next 14.2.5 after `npm audit` found 6-7 known vulnerabilities (including critical/high severity) in the Next 14 branch requiring a major-version fix; since the codebase was brand new with zero legacy surface, upgrading was strictly cheaper than pinning to a vulnerable version. Final `npm audit` reports 0 vulnerabilities.

## Risks

- **No real OCR integration yet.** The API route always returns the same fixed mock fixture regardless of the uploaded image's actual content — it does not yet do anything a user would recognize as "reading their receipt." This is the most visible gap before this is demo-able to an end user.
- **No real database.** The in-memory store is process-lifetime only — a server restart loses all data, and it will not survive a multi-instance deployment. Must be replaced before this goes anywhere near production, per the concept's stated Postgres choice.
- **req-4/req-5 not implemented**: low-confidence fields and missing total/date are not detected or flagged — `parseReceipt` will pass through `null`/missing OCR fields as empty strings/zero rather than triggering manual-review, which is a real functional gap against the full BR-1 scope (this slice only covers req-1/2/3/6, not all of BR-1).
- **No authentication.** The API route hard-codes `userId: "dev-user"` — req-23 (associate all data with a single owning user account) and req-27 (prevent cross-user exposure) are not implemented in this slice.
- **No duplicate-receipt detection** (BRD A14) — recurring merchant/date/total combinations are stored as distinct records with no prompt, which is correct per req-6's acceptance scenario but leaves BRD A14 unaddressed.
