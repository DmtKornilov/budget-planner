## Requirement

The system shall associate all stored receipts, line items, and statistics with a single owning user account.

## Rationale

Directly answers `actors`: the only human actor is the end user acting on their own data, with no admin or shared-access role, so per-user data ownership must be explicit. Per the concept's chosen approach, this is implemented as correctly-shaped logic against a placeholder single-user auth foundation in this process, not real authentication — see [[prob-1/concept-1]] Risks.

## Verification

Test: create a receipt and confirm the stored record carries the submitting user's account id.

## Traces to

- [[prob-1/concept-1]] — Chosen approach

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
