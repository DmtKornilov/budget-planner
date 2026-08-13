import type { LineItem } from "./types";
import { ExternalApiError } from "../errors";

/** req-4: per-field OCR confidence, 0-1. A missing entry is treated as full confidence (1). */
export interface OcrFieldConfidence {
  merchantName?: number;
  transactionDate?: number;
  transactionTime?: number;
  totalAmount?: number;
}

export interface OcrResult {
  merchantName: string;
  /**
   * req-5: an empty string means the transaction date could not be
   * extracted from the photo.
   */
  transactionDate: string;
  transactionTime: string;
  lineItems: LineItem[];
  /**
   * req-5: NaN means the total amount could not be extracted from the
   * photo. (Kept as `number`, not `number | null`, so the type stays a
   * strict additive extension of proc-1's shape.)
   */
  totalAmount: number;
  /** req-4: confidence scores backing the low-confidence-field flag. */
  fieldConfidence?: OcrFieldConfidence;
}

export interface OcrInput {
  buffer: Buffer;
  mimeType: string;
}

/**
 * Abstraction over the hosted OCR API named in the approved concept
 * ([[prob-1/concept-1]]). No real provider is wired up yet — see the
 * implementation note's Risks section. MockOcrProvider stands in until a
 * real provider (and its API credentials) is integrated.
 */
export interface OcrProvider {
  extract(input: OcrInput): Promise<OcrResult>;
}

export class MockOcrProvider implements OcrProvider {
  /**
   * @param fixture the canned extraction result to return.
   * @param failure req-28: when set, extract() rejects with this error
   *   instead of returning the fixture, simulating an OCR API failure/timeout.
   */
  constructor(
    private readonly fixture: OcrResult,
    private readonly failure?: ExternalApiError
  ) {}

  async extract(): Promise<OcrResult> {
    if (this.failure) {
      throw this.failure;
    }
    return this.fixture;
  }
}
