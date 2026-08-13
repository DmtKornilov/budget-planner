## Requirement

The position-matching service shall allow the user to manually override an automatic same-position or different-position determination.

## Rationale

Automatic matching will sometimes be wrong; the user must be able to correct it, mirroring the same correction pattern used for categorization.

## Verification

Test: override an automatic same-position determination and confirm the stored classification updates accordingly.

## Traces to

- [[prob-1/concept-1]] — Chosen approach

## Metadata

```json
{
  "id": "REQ-17",
  "title": "Allow manual override of position-match results",
  "pattern": "ubiquitous",
  "statement": "The position-matching service shall allow the user to manually override an automatic same-position or different-position determination.",
  "rationale": "Automatic matching will sometimes be wrong; the user must be able to correct it.",
  "priority": "should",
  "verification": "test",
  "traces_to": ["prob-1/concept-1"]
}
```
