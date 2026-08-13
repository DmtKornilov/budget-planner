## Requirement

The system shall not expose one user's stored data to another user.

## Rationale

Split from REQ-23 to keep each requirement to a single capability. This is the negative-space complement of ownership: association alone doesn't guarantee isolation without an explicit access-control requirement. Derived from BRD N2 and the confirmed `actors` answer.

## Verification

Test: create two user accounts with receipts each, and confirm neither account's API responses or views expose the other's data.

## Traces to

- [[prob-1/concept-1]] — Chosen approach, Postgres data layer

## Metadata

```json
{
  "id": "REQ-27",
  "title": "Prevent cross-user data exposure",
  "pattern": "ubiquitous",
  "statement": "The system shall not expose one user's stored data to another user.",
  "rationale": "Association alone doesn't guarantee isolation without an explicit access-control requirement.",
  "priority": "must",
  "verification": "test",
  "traces_to": ["prob-1/concept-1"]
}
```
