import { describe, expect, it } from "vitest";
import { InMemoryReceiptStore } from "./receiptStore";
import { calculateMonthlyBudget } from "../budget/budgetService";

function newReceipt(overrides: Partial<Parameters<InMemoryReceiptStore["save"]>[0]> = {}) {
  return {
    userId: "dev-user",
    imageRef: "receipt.jpg",
    merchant: "Fresh Market",
    transactionDate: "2026-07-20",
    transactionTime: "10:00",
    lineItems: [],
    totalAmount: 84.5,
    status: "parsed" as const,
    parserVersion: "v1",
    ...overrides,
  };
}

// Acceptance: prob-1/concept-1/req-18/feature-1 (REQ-22)
describe("InMemoryReceiptStore — encryption at rest (req-22)", () => {
  it("stores the receipt image reference encrypted at rest", () => {
    const store = new InMemoryReceiptStore();
    const receipt = store.save(newReceipt({ imageRef: "very-specific-image-name.jpg" }));
    const snapshot = store.getEncryptedSnapshot(receipt.id);
    expect(snapshot).toBeTruthy();
    expect(snapshot).not.toContain("very-specific-image-name.jpg");
  });

  it("stores extracted receipt and line-item data encrypted at rest", () => {
    const store = new InMemoryReceiptStore();
    const receipt = store.save(
      newReceipt({
        merchant: "Very Specific Merchant Name",
        lineItems: [{ name: "Very Specific Item", quantity: 1, unitPrice: 3.2, totalPrice: 3.2 }],
      })
    );
    const snapshot = store.getEncryptedSnapshot(receipt.id);
    expect(snapshot).not.toContain("Very Specific Merchant Name");
    expect(snapshot).not.toContain("Very Specific Item");
  });

  it("keeps updated data encrypted at rest after a category correction", () => {
    const store = new InMemoryReceiptStore();
    const receipt = store.save(
      newReceipt({ lineItems: [{ name: "Protein Bar XL", quantity: 1, unitPrice: 3.2, totalPrice: 3.2, category: "Groceries" }] })
    );

    store.update(receipt.id, {
      lineItems: [{ name: "Protein Bar XL", quantity: 1, unitPrice: 3.2, totalPrice: 3.2, category: "Health" }],
    });

    const snapshot = store.getEncryptedSnapshot(receipt.id);
    expect(snapshot).not.toContain("Health");
    expect(store.get(receipt.id)?.lineItems[0].category).toBe("Health");
  });
});

// Acceptance: prob-1/concept-1/req-19/feature-1 (REQ-23)
describe("InMemoryReceiptStore — associate data with a single owning user (req-23)", () => {
  it("carries the submitting user's account id on the stored receipt", () => {
    const store = new InMemoryReceiptStore();
    const receipt = store.save(newReceipt({ userId: "user-42" }));
    expect(receipt.userId).toBe("user-42");
  });

  it("scopes allForUser to only that user's receipts", () => {
    const store = new InMemoryReceiptStore();
    store.save(newReceipt({ userId: "user-a" }));
    store.save(newReceipt({ userId: "user-b" }));
    expect(store.allForUser("user-a")).toHaveLength(1);
    expect(store.allForUser("user-a")[0].userId).toBe("user-a");
  });
});

// Acceptance: prob-1/concept-1/req-23/feature-1 (REQ-27)
describe("InMemoryReceiptStore — prevent cross-user data exposure (req-27)", () => {
  it("never includes another user's receipts in a user's own list", () => {
    const store = new InMemoryReceiptStore();
    store.save(newReceipt({ userId: "user-a", merchant: "A's Market" }));
    store.save(newReceipt({ userId: "user-b", merchant: "B's Market" }));

    const listForA = store.allForUser("user-a");
    expect(listForA.every((r) => r.userId === "user-a")).toBe(true);
  });

  it("denies direct access to another user's receipt by id", () => {
    const store = new InMemoryReceiptStore();
    const bReceipt = store.save(newReceipt({ userId: "user-b" }));

    expect(store.getForUser(bReceipt.id, "user-a")).toBeUndefined();
  });
});

// Acceptance: prob-1/concept-1/req-20/feature-1 (REQ-24)
describe("InMemoryReceiptStore — immediate-effect deletion (req-24)", () => {
  it("removes a receipt so it no longer appears in all()", () => {
    const store = new InMemoryReceiptStore();
    const a = store.save(newReceipt({ totalAmount: 50 }));
    store.save(newReceipt({ totalAmount: 50 }));
    store.save(newReceipt({ totalAmount: 50 }));

    store.delete(a.id);

    expect(store.all()).toHaveLength(2);
    expect(store.get(a.id)).toBeUndefined();
  });

  it("zeroes out a month's total when the last receipt is deleted", () => {
    const store = new InMemoryReceiptStore();
    const only = store.save(newReceipt({ totalAmount: 20, transactionDate: "2026-07-05" }));
    store.delete(only.id);
    expect(store.all()).toHaveLength(0);

    const summary = calculateMonthlyBudget(store.allForUser("dev-user"), 2026, 7, new Date("2026-08-01T00:00:00Z"));
    expect(summary.total).toBe(0);
  });

  it("deleting one of several receipts updates the visible monthly total", () => {
    const store = new InMemoryReceiptStore();
    const a = store.save(newReceipt({ totalAmount: 50, transactionDate: "2026-07-01" }));
    store.save(newReceipt({ totalAmount: 50, transactionDate: "2026-07-10" }));
    store.save(newReceipt({ totalAmount: 50, transactionDate: "2026-07-20" }));

    const before = calculateMonthlyBudget(store.allForUser("dev-user"), 2026, 7, new Date("2026-08-01T00:00:00Z"));
    expect(before.total).toBe(150);

    store.delete(a.id);

    const after = calculateMonthlyBudget(store.allForUser("dev-user"), 2026, 7, new Date("2026-08-01T00:00:00Z"));
    expect(after.total).toBe(100);
  });
});

describe("InMemoryReceiptStore — update (used by category reassignment, req-10)", () => {
  it("updates fields on an existing receipt and preserves its id/userId/createdAt", () => {
    const store = new InMemoryReceiptStore();
    const receipt = store.save(newReceipt());
    const updated = store.update(receipt.id, { status: "flagged" });
    expect(updated?.id).toBe(receipt.id);
    expect(updated?.userId).toBe(receipt.userId);
    expect(updated?.status).toBe("flagged");
  });

  it("returns undefined when updating a non-existent receipt", () => {
    const store = new InMemoryReceiptStore();
    expect(store.update("does-not-exist", { status: "flagged" })).toBeUndefined();
  });
});
