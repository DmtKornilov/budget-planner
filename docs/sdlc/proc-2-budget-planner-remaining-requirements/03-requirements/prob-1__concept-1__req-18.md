## Requirement

The system shall store all receipt images and extracted receipt data encrypted at rest.

## Rationale

Directly answers the `compliance` question: no specific regulation was named, but this is financial data and the BRD's general requirement for encryption at rest still applies. Per the concept's chosen approach, this is implemented as correctly-shaped logic against a placeholder foundation in this process rather than real infrastructure, with that gap documented — see [[prob-1/concept-1]] Risks.

## Verification

Inspection: review the storage layer's implementation to confirm an encryption step is applied to receipt images and extracted data, and that the placeholder-vs-real-infrastructure status is documented.

## Traces to

- [[prob-1/concept-1]] — Chosen approach

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
