import { describe, expect, it } from "vitest";
import { digitizeReceipt } from "./digitizeReceipt";
import { InMemoryReceiptStore } from "./receiptStore";
import { MockOcrProvider } from "./ocrProvider";

function input(overrides: Partial<Parameters<typeof digitizeReceipt>[0]> = {}) {
  return {
    mimeType: "image/jpeg",
    imageBuffer: Buffer.from("fake-image-bytes"),
    userId: "user-1",
    imageRef: "receipt.jpg",
    ...overrides,
  };
}

// Acceptance: prob-1/concept-1/req-3/feature-1
describe("digitizeReceipt — extract structured data (req-3)", () => {
  it("extracts all fields from a single-item receipt", async () => {
    const ocr = new MockOcrProvider({
      merchantName: "Fresh Market",
      transactionDate: "2026-07-20",
      transactionTime: "14:32",
      lineItems: [
        { name: "Bananas 1kg", quantity: 1, unitPrice: 3.2, totalPrice: 3.2 },
      ],
      totalAmount: 3.2,
    });
    const store = new InMemoryReceiptStore();

    const receipt = await digitizeReceipt(input(), ocr, store);

    expect(receipt.merchant).toBe("Fresh Market");
    expect(receipt.transactionDate).toBe("2026-07-20");
    expect(receipt.transactionTime).toBe("14:32");
    expect(receipt.lineItems).toHaveLength(1);
    expect(receipt.totalAmount).toBe(3.2);
  });

  it("extracts all line items from a multi-item receipt, not only the first", async () => {
    const ocr = new MockOcrProvider({
      merchantName: "Fresh Market",
      transactionDate: "2026-07-20",
      transactionTime: "14:32",
      lineItems: [
        { name: "Bananas 1kg", quantity: 1, unitPrice: 3.2, totalPrice: 3.2 },
        { name: "Milk 2% 1L", quantity: 2, unitPrice: 4.5, totalPrice: 9.0 },
        { name: "Bread", quantity: 1, unitPrice: 5.0, totalPrice: 5.0 },
        { name: "Eggs", quantity: 1, unitPrice: 8.0, totalPrice: 8.0 },
        { name: "Coffee", quantity: 1, unitPrice: 15.0, totalPrice: 15.0 },
      ],
      totalAmount: 40.2,
    });
    const store = new InMemoryReceiptStore();

    const receipt = await digitizeReceipt(input(), ocr, store);

    expect(receipt.lineItems).toHaveLength(5);
  });
});

// Acceptance: prob-1/concept-1/req-6/feature-1
describe("digitizeReceipt — persist parsed receipts (req-6)", () => {
  it("stores the parsed receipt with a unique receipt identifier", async () => {
    const ocr = new MockOcrProvider({
      merchantName: "Fresh Market",
      transactionDate: "2026-07-20",
      transactionTime: "10:00",
      lineItems: [],
      totalAmount: 84.5,
    });
    const store = new InMemoryReceiptStore();

    const receipt = await digitizeReceipt(input(), ocr, store);

    expect(receipt.id).toBeTruthy();
    expect(store.get(receipt.id)).toEqual(receipt);
  });

  it("persists a recurring receipt as a distinct record with its own id", async () => {
    const ocr = new MockOcrProvider({
      merchantName: "Fresh Market",
      transactionDate: "2026-07-20",
      transactionTime: "10:00",
      lineItems: [],
      totalAmount: 84.5,
    });
    const store = new InMemoryReceiptStore();

    const first = await digitizeReceipt(input(), ocr, store);
    const second = await digitizeReceipt(input(), ocr, store);

    expect(first.id).not.toBe(second.id);
    expect(store.all()).toHaveLength(2);
  });
});
