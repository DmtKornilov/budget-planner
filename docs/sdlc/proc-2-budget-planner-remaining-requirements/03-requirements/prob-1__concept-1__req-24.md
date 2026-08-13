## Requirement

If the OCR API or the LLM API fails or times out, then the system shall notify the user with a message prompting them to try again.

## Rationale

Directly answers `failure-behaviour` for the one case that answer specifically named: when the OCR or LLM dependency itself is down or times out (as opposed to bad input), the system shows a generic try-again error with no automatic retry or queueing logic.

## Verification

Test: simulate an OCR or LLM API timeout and confirm the user sees a generic try-again message rather than a silent failure or an automatic retry.

## Traces to

- [[prob-1/concept-1]] — Chosen approach

## Metadata

```json
{
  "id": "REQ-28",
  "title": "Surface a generic error on OCR/LLM API failure",
  "pattern": "unwanted-behaviour",
  "statement": "If the OCR API or the LLM API fails or times out, then the system shall notify the user with a message prompting them to try again.",
  "rationale": "The confirmed failure-behaviour answer specifically named this case: a generic try-again error with no automatic retry.",
  "priority": "must",
  "verification": "test",
  "traces_to": ["prob-1/concept-1"]
}
```
