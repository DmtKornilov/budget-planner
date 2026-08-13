## Requirement

The system shall store all receipt images and extracted receipt data encrypted at rest.

## Rationale

Directly answers the `compliance` question: no specific regulation was named, but the BRD's general requirement for encryption at rest still applies since this is financial data. Derived from BRD N1.

## Verification

Inspection: review the database and object-storage configuration to confirm encryption at rest is enabled.

## Traces to

- [[prob-1/concept-1]] — Chosen approach, Postgres data layer

## Metadata

```json
{
  "id": "REQ-22",
  "title": "Encrypt receipt data at rest",
  "pattern": "ubiquitous",
  "statement": "The system shall store all receipt images and extracted receipt data encrypted at rest.",
  "rationale": "No specific regulation was named, but this is financial data and the BRD's general encryption requirement still applies.",
  "priority": "must",
  "verification": "inspection",
  "traces_to": ["prob-1/concept-1"]
}
```
