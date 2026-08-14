## Requirement

The application shall preserve the existing functional behavior of the four screens — receipt display, category reassignment, and budget calculation — unchanged while the visual design in this piece of work is applied.

## Rationale

[[prob-1]] (Out of scope) and [[prob-1/concept-1]] (Out of scope) both exclude any change to business logic, receipt parsing, categorization, or budget calculation. This requirement makes that boundary independently verifiable rather than only stated as an intent.

## Verification

Test: the existing automated test suite (`npm test`) continues to pass unchanged after the visual design work is applied, with no test modified to accommodate a behavior change.

## Traces to

- [[prob-1/concept-1]] — Out of scope

## Metadata

```json
{
  "id": "UI-9",
  "title": "Preserve existing functional behavior",
  "pattern": "ubiquitous",
  "statement": "The application shall preserve the existing functional behavior of the four screens — receipt display, category reassignment, and budget calculation — unchanged while the visual design in this piece of work is applied.",
  "rationale": "Makes the concept's and brief's out-of-scope boundary (no business-logic changes) independently verifiable via the existing automated test suite.",
  "priority": "must",
  "verification": "test",
  "traces_to": ["prob-1/concept-1"]
}
```
