## Requirement

The system shall associate all stored receipts, line items, and statistics with a single owning user account.

## Rationale

Directly answers `actors`: the only human actor is the end user acting on their own data, with no admin or shared-access role, so per-user data ownership must be explicit. Derived from BRD N2.

## Verification

Test: create a receipt and confirm the stored record carries the submitting user's account id.

## Traces to

- [[prob-1/concept-1]] — Chosen approach, Postgres data layer

## Metadata

```json
{
  "id": "REQ-23",
  "title": "Associate all data with a single owning user account",
  "pattern": "ubiquitous",
  "statement": "The system shall associate all stored receipts, line items, and statistics with a single owning user account.",
  "rationale": "The only human actor is the end user acting on their own data, with no admin or shared-access role.",
  "priority": "must",
  "verification": "test",
  "traces_to": ["prob-1/concept-1"]
}
```
