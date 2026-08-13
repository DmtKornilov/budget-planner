import { validateFormat } from "./validateFormat";
import { parseReceipt } from "./parseReceipt";
import type { OcrProvider } from "./ocrProvider";
import type { ReceiptStore } from "./receiptStore";
import type { StoredReceipt } from "./types";

const PARSER_VERSION = "v0.1.0-mock-ocr";

export interface DigitizeReceiptInput {
  mimeType: string;
  imageBuffer: Buffer;
  userId: string;
  imageRef: string;
}

/**
 * Orchestrates the receipt digitization service: validate format (req-1,
 * req-2), extract structured data via OCR (req-3), persist the result
 * (req-6). One requirement per collaborator, composed here.
 */
export async function digitizeReceipt(
  input: DigitizeReceiptInput,
  ocr: OcrProvider,
  store: ReceiptStore
): Promise<StoredReceipt> {
  validateFormat(input.mimeType);

  const ocrResult = await ocr.extract({
    buffer: input.imageBuffer,
    mimeType: input.mimeType,
  });
  const extracted = parseReceipt(ocrResult);

  return store.save({
    userId: input.userId,
    imageRef: input.imageRef,
    merchant: extracted.merchantName,
    transactionDate: extracted.transactionDate,
    transactionTime: extracted.transactionTime,
    lineItems: extracted.lineItems,
    totalAmount: extracted.totalAmount,
    status: "parsed",
    parserVersion: PARSER_VERSION,
  });
}
