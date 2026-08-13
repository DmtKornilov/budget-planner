import type { LineItem } from "./types";

export interface OcrResult {
  merchantName: string;
  transactionDate: string;
  transactionTime: string;
  lineItems: LineItem[];
  totalAmount: number;
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
  constructor(private readonly fixture: OcrResult) {}

  async extract(): Promise<OcrResult> {
    return this.fixture;
  }
}
