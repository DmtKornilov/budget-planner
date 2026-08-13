## Requirement

If the submitted file is not a supported format, then the receipt digitization service shall reject the upload and return an error message specifying the accepted formats.

## Rationale

Directly answers the `failure-behaviour` question: the confirmed answer is that the BRD's existing failure handling (reject bad formats with a clear error) is sufficient for MVP. Derived from BRD A2.

## Verification

Test: submit an unsupported file type and confirm the returned error message names the accepted formats.

## Traces to

- [[prob-1/concept-1]] — Chosen approach, receipt parsing via hosted OCR API

## Metadata

```json
{
  "id": "REQ-2",
  "title": "Reject unsupported file formats",
  "pattern": "unwanted-behaviour",
  "statement": "If the submitted file is not a supported format, then the receipt digitization service shall reject the upload and return an error message specifying the accepted formats.",
  "rationale": "Confirmed via the failure-behaviour answer: BRD's existing failure handling is sufficient for MVP.",
  "priority": "must",
  "verification": "test",
  "traces_to": ["prob-1/concept-1"]
}
```
