import { validateFormat } from "./validateFormat";
import { parseReceipt, getMissingRequiredFields } from "./parseReceipt";
import type { OcrProvider } from "./ocrProvider";
import type { ReceiptStore } from "./receiptStore";
import type { StoredReceipt, ReceiptStatus } from "./types";
import type { Categorizer } from "../categorization/categorizer";
import type { CorrectionStore } from "../categorization/correctionStore";
import { categorizeReceiptLineItems } from "../categorization/categorizeReceipt";

const PARSER_VERSION = "v0.1.0-mock-ocr";

export interface DigitizeReceiptInput {
  mimeType: string;
  imageBuffer: Buffer;
  userId: string;
  imageRef: string;
}

export interface DigitizeReceiptCollaborators {
  ocr: OcrProvider;
  store: ReceiptStore;
  categorizer: Categorizer;
  corrections: CorrectionStore;
}

/**
 * Orchestrates the receipt digitization service: validate format (req-1,
 * req-2), extract structured data via OCR (req-3), flag low-confidence
 * fields (req-4), route to manual review when the total amount or
 * transaction date is missing (req-5), categorize line items (req-7,
 * req-8, req-9, req-11), and persist the result (req-6, req-22, req-23).
 *
 * req-28: an OCR failure (ExternalApiError from the OcrProvider) is not
 * caught here — it propagates so the API route can turn it into the
 * generic "try again" response without an automatic retry.
 */
export async function digitizeReceipt(
  input: DigitizeReceiptInput,
  ocr: OcrProvider,
  store: ReceiptStore,
  categorizer: Categorizer,
  corrections: CorrectionStore
): Promise<StoredReceipt> {
  validateFormat(input.mimeType);

  const ocrResult = await ocr.extract({
    buffer: input.imageBuffer,
    mimeType: input.mimeType,
  });
  const extracted = parseReceipt(ocrResult);
  const missingFields = getMissingRequiredFields(ocrResult);

  const categorizedLineItems = categorizeReceiptLineItems(
    extracted.merchantName,
    extracted.lineItems,
    categorizer,
    corrections
  );

  let status: ReceiptStatus = "parsed";
  if (missingFields.length > 0) {
    status = "manual_review";
  } else if ((extracted.lowConfidenceFields ?? []).length > 0) {
    status = "flagged";
  }

  return store.save({
    userId: input.userId,
    imageRef: input.imageRef,
    merchant: extracted.merchantName,
    transactionDate: extracted.transactionDate,
    transactionTime: extracted.transactionTime,
    lineItems: categorizedLineItems,
    totalAmount: extracted.totalAmount,
    status,
    parserVersion: PARSER_VERSION,
    lowConfidenceFields: extracted.lowConfidenceFields,
  });
}
