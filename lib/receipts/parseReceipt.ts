import type { ExtractedReceipt } from "./types";
import type { OcrResult } from "./ocrProvider";
import { OCR_CONFIDENCE_THRESHOLD } from "../config";

/** The OCR-extracted fields req-4 flags confidence on and req-5 checks for absence. */
const REQUIRED_FIELDS = [
  "merchantName",
  "transactionDate",
  "transactionTime",
  "totalAmount",
] as const;

export type RequiredField = (typeof REQUIRED_FIELDS)[number];

/**
 * req-4: names of required fields whose OCR confidence is strictly below
 * the configured threshold. A field with no confidence entry is treated as
 * full confidence (never flagged) — every existing OcrResult fixture that
 * doesn't set fieldConfidence keeps behaving exactly as before.
 */
export function getLowConfidenceFields(
  ocrResult: OcrResult,
  threshold: number = OCR_CONFIDENCE_THRESHOLD
): RequiredField[] {
  const confidence = ocrResult.fieldConfidence ?? {};
  return REQUIRED_FIELDS.filter((field) => {
    const score = confidence[field];
    return score !== undefined && score < threshold;
  });
}

/**
 * req-5: the total amount is "missing" when it could not be extracted
 * (represented as NaN by the OCR layer); the transaction date is "missing"
 * when it is empty/blank.
 */
export function getMissingRequiredFields(ocrResult: OcrResult): RequiredField[] {
  const missing: RequiredField[] = [];
  if (Number.isNaN(ocrResult.totalAmount)) {
    missing.push("totalAmount");
  }
  if (!ocrResult.transactionDate || ocrResult.transactionDate.trim() === "") {
    missing.push("transactionDate");
  }
  return missing;
}

/**
 * req-3: extract merchant name, transaction date, transaction time, line
 * items, and total amount from OCR output.
 * req-4: also compute which required fields fall below the confidence
 * threshold, so the digitization orchestrator can flag them.
 */
export function parseReceipt(ocrResult: OcrResult): ExtractedReceipt {
  return {
    merchantName: ocrResult.merchantName,
    transactionDate: ocrResult.transactionDate,
    transactionTime: ocrResult.transactionTime,
    lineItems: ocrResult.lineItems,
    totalAmount: ocrResult.totalAmount,
    lowConfidenceFields: getLowConfidenceFields(ocrResult),
  };
}
