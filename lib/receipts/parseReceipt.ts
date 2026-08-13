import type { ExtractedReceipt } from "./types";
import type { OcrResult } from "./ocrProvider";

/**
 * req-3: extract merchant name, transaction date, transaction time, line
 * items, and total amount from OCR output.
 *
 * Low-confidence flagging (req-4) and manual-review routing on missing
 * total/date (req-5) are out of scope for this slice — see the
 * implementation note's Design notes.
 */
export function parseReceipt(ocrResult: OcrResult): ExtractedReceipt {
  return {
    merchantName: ocrResult.merchantName,
    transactionDate: ocrResult.transactionDate,
    transactionTime: ocrResult.transactionTime,
    lineItems: ocrResult.lineItems,
    totalAmount: ocrResult.totalAmount,
  };
}
