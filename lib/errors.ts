/**
 * Shared domain error types used across the new service areas, following
 * the same pattern proc-1 established with UnsupportedFormatError
 * (lib/receipts/validateFormat.ts): a route catches a specific error class
 * and turns it into the right HTTP response.
 */

/**
 * req-28: raised when the (mocked) OCR API or the (mocked) LLM/categorization
 * API fails or times out. Routes catch this and return a generic
 * "try again" message rather than exposing internal failure detail, and
 * never retry automatically.
 */
export class ExternalApiError extends Error {
  constructor(message = "Something went wrong. Please try again.") {
    super(message);
    this.name = "ExternalApiError";
  }
}

/**
 * req-23 / req-27: raised when a request attempts to access or mutate a
 * record owned by a different user account.
 */
export class ForbiddenError extends Error {
  constructor(message = "You do not have access to this resource.") {
    super(message);
    this.name = "ForbiddenError";
  }
}
