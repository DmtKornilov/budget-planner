## Requirement

If one or both of two compared check photos fail parsing, then the position-matching service shall return a comparison-not-possible result stating the parsing failure as the reason.

## Rationale

Directly answers `failure-behaviour` for the multi-photo comparison path: a failed comparison must be visible, not silently skipped or guessed at. Derived from BRD B6.

## Verification

Test: submit one unparseable photo alongside one valid photo for comparison and confirm the result states comparison-not-possible with the reason.

## Traces to

- [[prob-1/concept-1]] — Chosen approach

## Metadata

```json
{
  "id": "REQ-16",
  "title": "Report comparison-not-possible on parse failure",
  "pattern": "unwanted-behaviour",
  "statement": "If one or both of two compared check photos fail parsing, then the position-matching service shall return a comparison-not-possible result stating the parsing failure as the reason.",
  "rationale": "A failed comparison must be visible, not silently skipped or guessed at.",
  "priority": "should",
  "verification": "test",
  "traces_to": ["prob-1/concept-1"]
}
```
