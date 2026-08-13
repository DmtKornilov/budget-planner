/**
 * Configuration thresholds explicitly left undefined by the requirements
 * baseline (docs/sdlc/proc-2-budget-planner-remaining-requirements/srs-1/baseline.md,
 * "Open questions and assumptions" — Proposed vs. confirmed thresholds /
 * Confidence thresholds undefined). Requirements text specifies only
 * relative behavior ("below the threshold" vs. "at or above it"); no numeric
 * value was proposed or confirmed during requirements/acceptance.
 *
 * These are reasonable implementation-level defaults chosen so the
 * acceptance scenarios can actually be exercised, not values derived from
 * any requirement. Swap for real business/configuration input later.
 */

/** REQ-4: OCR confidence threshold for required extracted fields. */
export const OCR_CONFIDENCE_THRESHOLD = 0.7;

/** REQ-9: categorization confidence threshold. */
export const CATEGORIZATION_CONFIDENCE_THRESHOLD = 0.6;

/** REQ-21 / REQ-26: minimum number of receipts on record before goal advice is generated. */
export const MIN_RECEIPTS_FOR_ADVICE = 5;
