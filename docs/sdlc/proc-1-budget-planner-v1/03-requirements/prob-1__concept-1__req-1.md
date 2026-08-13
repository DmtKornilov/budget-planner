## Requirement

When a user submits a check photo, the receipt digitization service shall validate that the file is a supported image format (JPEG, PNG, HEIC, or PDF-scan) before processing.

## Rationale

Bad input format is the first failure mode in the digitization pipeline; validating up front prevents wasted OCR calls on files that can never parse. Derived from the BRD's A1, carried into [[prob-1/concept-1]]'s chosen approach (receipt parsing via a hosted OCR API).

## Verification

Test: submit files of each supported and unsupported type and confirm accept/reject behavior.

## Traces to

- [[prob-1/concept-1]] — Chosen approach, receipt parsing via hosted OCR API

## Metadata

```json
{
  "id": "REQ-1",
  "title": "Validate uploaded file format",
  "pattern": "event-driven",
  "statement": "When a user submits a check photo, the receipt digitization service shall validate that the file is a supported image format (JPEG, PNG, HEIC, or PDF-scan) before processing.",
  "rationale": "Bad input format is the first failure mode in the digitization pipeline; validating up front prevents wasted OCR calls on files that can never parse.",
  "priority": "must",
  "verification": "test",
  "traces_to": ["prob-1/concept-1"]
}
```
