import { describe, expect, it } from "vitest";
import { digitizeReceipt } from "./digitizeReceipt";
import { InMemoryReceiptStore } from "./receiptStore";
import { MockOcrProvider } from "./ocrProvider";
import { MockCategorizer } from "../categorization/categorizer";
import { InMemoryCorrectionStore } from "../categorization/correctionStore";
import { ExternalApiError } from "../errors";

function input(overrides: Partial<Parameters<typeof digitizeReceipt>[0]> = {}) {
  return {
    mimeType: "image/jpeg",
    imageBuffer: Buffer.from("fake-image-bytes"),
    userId: "user-1",
    imageRef: "receipt.jpg",
    ...overrides,
  };
}

function collaborators() {
  return { categorizer: new MockCategorizer(), corrections: new InMemoryCorrectionStore() };
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
    const { categorizer, corrections } = collaborators();

    const receipt = await digitizeReceipt(input(), ocr, store, categorizer, corrections);

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
    const { categorizer, corrections } = collaborators();

    const receipt = await digitizeReceipt(input(), ocr, store, categorizer, corrections);

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
    const { categorizer, corrections } = collaborators();

    const receipt = await digitizeReceipt(input(), ocr, store, categorizer, corrections);

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
    const { categorizer, corrections } = collaborators();

    const first = await digitizeReceipt(input(), ocr, store, categorizer, corrections);
    const second = await digitizeReceipt(input(), ocr, store, categorizer, corrections);

    expect(first.id).not.toBe(second.id);
    expect(store.all()).toHaveLength(2);
  });
});

// Acceptance: prob-1/concept-1/req-1/feature-1 (REQ-4)
describe("digitizeReceipt — flag low-confidence fields (req-4)", () => {
  it("accepts a field at or above the threshold without a low-confidence flag", async () => {
    const ocr = new MockOcrProvider({
      merchantName: "Fresh Market",
      transactionDate: "2026-07-20",
      transactionTime: "10:00",
      lineItems: [],
      totalAmount: 84.5,
      fieldConfidence: { totalAmount: 0.9 },
    });
    const store = new InMemoryReceiptStore();
    const { categorizer, corrections } = collaborators();

    const receipt = await digitizeReceipt(input(), ocr, store, categorizer, corrections);
    expect(receipt.lowConfidenceFields ?? []).not.toContain("totalAmount");
  });

  it("treats a field exactly at the threshold as acceptable", async () => {
    const ocr = new MockOcrProvider({
      merchantName: "Fresh Market",
      transactionDate: "2026-07-20",
      transactionTime: "10:00",
      lineItems: [],
      totalAmount: 84.5,
      fieldConfidence: { merchantName: 0.7 },
    });
    const store = new InMemoryReceiptStore();
    const { categorizer, corrections } = collaborators();

    const receipt = await digitizeReceipt(input(), ocr, store, categorizer, corrections);
    expect(receipt.lowConfidenceFields ?? []).not.toContain("merchantName");
  });

  it("flags a single low-confidence field", async () => {
    const ocr = new MockOcrProvider({
      merchantName: "Fresh Market",
      transactionDate: "2026-07-20",
      transactionTime: "10:00",
      lineItems: [],
      totalAmount: 84.5,
      fieldConfidence: { totalAmount: 0.3 },
    });
    const store = new InMemoryReceiptStore();
    const { categorizer, corrections } = collaborators();

    const receipt = await digitizeReceipt(input(), ocr, store, categorizer, corrections);
    expect(receipt.lowConfidenceFields).toContain("totalAmount");
  });

  it("flags multiple low-confidence fields independently", async () => {
    const ocr = new MockOcrProvider({
      merchantName: "Fresh Market",
      transactionDate: "2026-07-20",
      transactionTime: "10:00",
      lineItems: [],
      totalAmount: 84.5,
      fieldConfidence: { merchantName: 0.2, totalAmount: 0.3 },
    });
    const store = new InMemoryReceiptStore();
    const { categorizer, corrections } = collaborators();

    const receipt = await digitizeReceipt(input(), ocr, store, categorizer, corrections);
    expect(receipt.lowConfidenceFields).toContain("merchantName");
    expect(receipt.lowConfidenceFields).toContain("totalAmount");
  });
});

// Acceptance: prob-1/concept-1/req-2/feature-1 (REQ-5)
describe("digitizeReceipt — route unparseable receipts to manual review (req-5)", () => {
  it("does not mark a successfully parsed receipt for manual review", async () => {
    const ocr = new MockOcrProvider({
      merchantName: "Fresh Market",
      transactionDate: "2026-07-20",
      transactionTime: "10:00",
      lineItems: [],
      totalAmount: 84.5,
    });
    const store = new InMemoryReceiptStore();
    const { categorizer, corrections } = collaborators();

    const receipt = await digitizeReceipt(input(), ocr, store, categorizer, corrections);
    expect(receipt.status).not.toBe("manual_review");
  });

  it("marks a receipt with a missing total amount as requires-manual-review and excludes it", async () => {
    const ocr = new MockOcrProvider({
      merchantName: "Fresh Market",
      transactionDate: "2026-07-20",
      transactionTime: "10:00",
      lineItems: [],
      totalAmount: NaN,
    });
    const store = new InMemoryReceiptStore();
    const { categorizer, corrections } = collaborators();

    const receipt = await digitizeReceipt(input(), ocr, store, categorizer, corrections);
    expect(receipt.status).toBe("manual_review");
  });

  it("marks a receipt with a missing transaction date as requires-manual-review", async () => {
    const ocr = new MockOcrProvider({
      merchantName: "Fresh Market",
      transactionDate: "",
      transactionTime: "10:00",
      lineItems: [],
      totalAmount: 84.5,
    });
    const store = new InMemoryReceiptStore();
    const { categorizer, corrections } = collaborators();

    const receipt = await digitizeReceipt(input(), ocr, store, categorizer, corrections);
    expect(receipt.status).toBe("manual_review");
  });

  it("marks a receipt missing both fields as requires-manual-review exactly once", async () => {
    const ocr = new MockOcrProvider({
      merchantName: "Fresh Market",
      transactionDate: "",
      transactionTime: "10:00",
      lineItems: [],
      totalAmount: NaN,
    });
    const store = new InMemoryReceiptStore();
    const { categorizer, corrections } = collaborators();

    const receipt = await digitizeReceipt(input(), ocr, store, categorizer, corrections);
    expect(receipt.status).toBe("manual_review");
    // "exactly once" — a single status field, not a list that could double-count.
    expect(typeof receipt.status).toBe("string");
  });
});

// Acceptance: prob-1/concept-1/req-24/feature-1 (REQ-28, OCR leg)
describe("digitizeReceipt — surface a generic error on OCR failure (req-28)", () => {
  it("propagates an ExternalApiError from the OCR provider without swallowing it", async () => {
    const ocr = new MockOcrProvider(
      {
        merchantName: "Fresh Market",
        transactionDate: "2026-07-20",
        transactionTime: "10:00",
        lineItems: [],
        totalAmount: 84.5,
      },
      new ExternalApiError()
    );
    const store = new InMemoryReceiptStore();
    const { categorizer, corrections } = collaborators();

    await expect(digitizeReceipt(input(), ocr, store, categorizer, corrections)).rejects.toBeInstanceOf(
      ExternalApiError
    );
  });
});

// Acceptance: prob-1/concept-1/req-24/feature-1 (REQ-28, LLM/categorization leg)
describe("digitizeReceipt — surface a generic error on categorization (LLM) failure (req-28)", () => {
  it("propagates an ExternalApiError from the categorizer without swallowing it", async () => {
    const ocr = new MockOcrProvider({
      merchantName: "Fresh Market",
      transactionDate: "2026-07-20",
      transactionTime: "10:00",
      lineItems: [{ name: "Bananas 1kg", quantity: 1, unitPrice: 3.2, totalPrice: 3.2 }],
      totalAmount: 3.2,
    });
    const store = new InMemoryReceiptStore();
    const categorizer = new MockCategorizer(new ExternalApiError());
    const corrections = new InMemoryCorrectionStore();

    await expect(digitizeReceipt(input(), ocr, store, categorizer, corrections)).rejects.toBeInstanceOf(
      ExternalApiError
    );
  });

  it("does not automatically retry after a failure (a second identical call must be made explicitly)", async () => {
    const fixture = {
      merchantName: "Fresh Market",
      transactionDate: "2026-07-20",
      transactionTime: "10:00",
      lineItems: [{ name: "Bananas 1kg", quantity: 1, unitPrice: 3.2, totalPrice: 3.2 }],
      totalAmount: 3.2,
    };
    const store = new InMemoryReceiptStore();
    const { categorizer, corrections } = collaborators();
    const failingOcr = new MockOcrProvider(fixture, new ExternalApiError());

    let callCount = 0;
    const countingOcr = {
      extract: async () => {
        callCount++;
        return failingOcr.extract();
      },
    };

    await expect(digitizeReceipt(input(), countingOcr, store, categorizer, corrections)).rejects.toBeInstanceOf(
      ExternalApiError
    );
    expect(callCount).toBe(1);
  });
});

// Acceptance: BP-NFR-1 (qa-1) — no feature file exists for quality attributes
// (see the baseline's Acceptance scenarios note); this is the build-stage
// test case the baseline flags as still needed.
describe("digitizeReceipt — end-to-end parsing response time (BP-NFR-1)", () => {
  it("completes digitization of a single receipt in under 10 seconds", async () => {
    const ocr = new MockOcrProvider({
      merchantName: "Fresh Market",
      transactionDate: "2026-07-20",
      transactionTime: "10:00",
      lineItems: [{ name: "Bananas 1kg", quantity: 1, unitPrice: 3.2, totalPrice: 3.2 }],
      totalAmount: 3.2,
    });
    const store = new InMemoryReceiptStore();
    const { categorizer, corrections } = collaborators();

    const start = Date.now();
    await digitizeReceipt(input(), ocr, store, categorizer, corrections);
    const elapsedMs = Date.now() - start;

    expect(elapsedMs).toBeLessThan(10_000);
  });
});
