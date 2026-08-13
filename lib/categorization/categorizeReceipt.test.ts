import { describe, expect, it } from "vitest";
import { categorizeReceiptLineItems, reassignLineItem, reassignCategoryAndLearn } from "./categorizeReceipt";
import { MockCategorizer } from "./categorizer";
import { InMemoryCorrectionStore } from "./correctionStore";
import { UNCATEGORIZED, CATEGORY_TAXONOMY } from "./categories";
import { InMemoryReceiptStore } from "../receipts/receiptStore";
import type { LineItem } from "../receipts/types";

function item(overrides: Partial<LineItem> = {}): LineItem {
  return { name: "Bananas 1kg", quantity: 1, unitPrice: 3.2, totalPrice: 3.2, ...overrides };
}

// Acceptance: prob-1/concept-1/req-3/feature-1 (REQ-7)
describe("categorizeReceiptLineItems — categorize on successful parse (req-7)", () => {
  it("assigns a recognized item to its category", () => {
    const [result] = categorizeReceiptLineItems(
      "Fresh Market",
      [item({ name: "Bananas 1kg" })],
      new MockCategorizer(),
      new InMemoryCorrectionStore()
    );
    expect(result.category).toBe("Groceries");
  });

  it("categorizes each item on a multi-category receipt independently", () => {
    const results = categorizeReceiptLineItems(
      "Fresh Market",
      [
        item({ name: "Bananas 1kg" }),
        item({ name: "bus ticket" }),
        item({ name: "restaurant meal" }),
      ],
      new MockCategorizer(),
      new InMemoryCorrectionStore()
    );
    expect(results[0].category).toBe("Groceries");
    expect(results[1].category).toBe("Transportation");
    expect(results[2].category).toBe("Dining");
  });
});

// Acceptance: prob-1/concept-1/req-4/feature-1 (REQ-8)
describe("Uncategorized fallback (req-8)", () => {
  it("is listed in the category taxonomy before any receipts exist", () => {
    expect(CATEGORY_TAXONOMY).toContain(UNCATEGORIZED);
  });

  it("is selectable as a line item's category when it cannot be confidently classified", () => {
    const [result] = categorizeReceiptLineItems(
      "Fresh Market",
      [item({ name: "xyz-unknown-item-9482" })],
      new MockCategorizer(),
      new InMemoryCorrectionStore()
    );
    expect(result.category).toBe(UNCATEGORIZED);
  });
});

// Acceptance: prob-1/concept-1/req-5/feature-1 (REQ-9)
describe("categorizeReceiptLineItems — low-confidence routing (req-9)", () => {
  it("assigns the real category without flagging when confidence is above the threshold", () => {
    const [result] = categorizeReceiptLineItems(
      "Fresh Market",
      [item({ name: "Bananas 1kg" })],
      new MockCategorizer(),
      new InMemoryCorrectionStore(),
      0.5
    );
    expect(result.category).toBe("Groceries");
    expect(result.categoryFlaggedForReview).toBe(false);
  });

  it("treats confidence exactly at the threshold as acceptable", () => {
    const categorizer = { categorize: () => ({ category: "Groceries", confidence: 0.6 }) };
    const [result] = categorizeReceiptLineItems(
      "Fresh Market",
      [item()],
      categorizer,
      new InMemoryCorrectionStore(),
      0.6
    );
    expect(result.category).toBe("Groceries");
    expect(result.categoryFlaggedForReview).toBe(false);
  });

  it("falls back to Uncategorized and flags for review below the threshold", () => {
    const [result] = categorizeReceiptLineItems(
      "Fresh Market",
      [item({ name: "ambiguous-thing" })],
      new MockCategorizer(),
      new InMemoryCorrectionStore(),
      0.5
    );
    expect(result.category).toBe(UNCATEGORIZED);
    expect(result.categoryFlaggedForReview).toBe(true);
  });
});

// Acceptance: prob-1/concept-1/req-6/feature-1 (REQ-10)
describe("reassignLineItem — manual category reassignment (req-10)", () => {
  it("updates the category for the targeted item", () => {
    const items = [item({ name: "Protein Bar XL", category: "Groceries" })];
    const updated = reassignLineItem(items, 0, "Health");
    expect(updated[0].category).toBe("Health");
  });

  it("clears the review flag once manually reassigned", () => {
    const items = [item({ name: "Protein Bar XL", category: UNCATEGORIZED, categoryFlaggedForReview: true })];
    const updated = reassignLineItem(items, 0, "Health");
    expect(updated[0].categoryFlaggedForReview).toBe(false);
  });
});

describe("reassignCategoryAndLearn — persists across a later, separate view (req-10)", () => {
  it("stores the reassigned category so it still shows on a later read", () => {
    const store = new InMemoryReceiptStore();
    const corrections = new InMemoryCorrectionStore();
    const receipt = store.save({
      userId: "dev-user",
      imageRef: "r.jpg",
      merchant: "FitMart",
      transactionDate: "2026-07-01",
      transactionTime: "10:00",
      lineItems: [item({ name: "Protein Bar XL", category: "Groceries" })],
      totalAmount: 3.2,
      status: "parsed",
      parserVersion: "v1",
    });

    reassignCategoryAndLearn(store, corrections, receipt.id, 0, "Health");

    // a later, separate read from the store
    const reloaded = store.get(receipt.id);
    expect(reloaded?.lineItems[0].category).toBe("Health");
  });
});

// Acceptance: prob-1/concept-1/req-7/feature-1 (REQ-11)
describe("categorizeReceiptLineItems — learned corrections (req-11)", () => {
  it("applies a correction to a later receipt from the same merchant", () => {
    const corrections = new InMemoryCorrectionStore();
    corrections.recordCorrection("FitMart", "Protein Bar XL", "Health");

    const [result] = categorizeReceiptLineItems(
      "FitMart",
      [item({ name: "Protein Bar XL" })],
      new MockCategorizer(),
      corrections
    );
    expect(result.category).toBe("Health");
  });

  it("does not apply the correction to the same item name from a different merchant", () => {
    const corrections = new InMemoryCorrectionStore();
    corrections.recordCorrection("FitMart", "Protein Bar XL", "Health");

    const [result] = categorizeReceiptLineItems(
      "Corner Store",
      [item({ name: "Protein Bar XL" })],
      new MockCategorizer(),
      corrections
    );
    expect(result.category).not.toBe("Health");
  });

  it("end-to-end: a manual reassignment via reassignCategoryAndLearn changes categorization of a later receipt from the same merchant", () => {
    const store = new InMemoryReceiptStore();
    const corrections = new InMemoryCorrectionStore();
    const categorizer = new MockCategorizer();

    const firstReceipt = store.save({
      userId: "dev-user",
      imageRef: "r1.jpg",
      merchant: "FitMart",
      transactionDate: "2026-07-01",
      transactionTime: "10:00",
      lineItems: categorizeReceiptLineItems("FitMart", [item({ name: "Protein Bar XL" })], categorizer, corrections),
      totalAmount: 3.2,
      status: "parsed",
      parserVersion: "v1",
    });
    expect(firstReceipt.lineItems[0].category).not.toBe("Health");

    reassignCategoryAndLearn(store, corrections, firstReceipt.id, 0, "Health");

    const secondReceiptLineItems = categorizeReceiptLineItems(
      "FitMart",
      [item({ name: "Protein Bar XL" })],
      categorizer,
      corrections
    );
    expect(secondReceiptLineItems[0].category).toBe("Health");
  });
});
