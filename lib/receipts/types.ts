export type SupportedFormat = "JPEG" | "PNG" | "HEIC" | "PDF-scan";

export interface LineItem {
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  /** req-7/req-8/req-9: assigned category, from the predefined taxonomy or "Uncategorized". */
  category?: string;
  /** req-9: true when categorization confidence was below the threshold and the item needs user review. */
  categoryFlaggedForReview?: boolean;
}

export interface ExtractedReceipt {
  merchantName: string;
  transactionDate: string;
  transactionTime: string;
  lineItems: LineItem[];
  totalAmount: number;
  /** req-4: names of required fields whose OCR confidence fell below the configured threshold. */
  lowConfidenceFields?: string[];
}

export type ReceiptStatus = "parsed" | "flagged" | "manual_review";

export interface StoredReceipt {
  id: string;
  userId: string;
  imageRef: string;
  merchant: string;
  transactionDate: string;
  transactionTime: string;
  lineItems: LineItem[];
  totalAmount: number;
  status: ReceiptStatus;
  parserVersion: string;
  createdAt: string;
  /** req-4: names of required fields whose OCR confidence fell below the configured threshold. */
  lowConfidenceFields?: string[];
}
