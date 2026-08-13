export type SupportedFormat = "JPEG" | "PNG" | "HEIC" | "PDF-scan";

export interface LineItem {
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface ExtractedReceipt {
  merchantName: string;
  transactionDate: string;
  transactionTime: string;
  lineItems: LineItem[];
  totalAmount: number;
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
}
