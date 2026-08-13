import { describe, expect, it } from "vitest";
import { calculateMonthlyBudget } from "./budgetService";
import type { StoredReceipt } from "../receipts/types";

function receipt(overrides: Partial<StoredReceipt> = {}): StoredReceipt {
  return {
    id: "r-" + Math.random(),
    userId: "dev-user",
    imageRef: "receipt.jpg",
    merchant: "Fresh Market",
    transactionDate: "2026-06-15",
    transactionTime: "10:00",
    lineItems: [],
    totalAmount: 10,
    status: "parsed",
    parserVersion: "v1",
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

// Acceptance: prob-1/concept-1/req-8/feature-1 (REQ-12)
describe("calculateMonthlyBudget — aggregate monthly spend (req-12)", () => {
  it("sums all line-item totals for the requested month", () => {
    const receipts = Array.from({ length: 15 }, () => receipt({ totalAmount: 10, transactionDate: "2026-06-10" }));
    const summary = calculateMonthlyBudget(receipts, 2026, 6, new Date("2026-08-01T00:00:00Z"));
    expect(summary.total).toBe(150);
  });

  it("uses transaction date, not upload date, for month assignment", () => {
    const receipts = [
      receipt({ transactionDate: "2026-06-28", totalAmount: 20, createdAt: "2026-07-02T00:00:00Z" }),
    ];
    const june = calculateMonthlyBudget(receipts, 2026, 6, new Date("2026-08-01T00:00:00Z"));
    const july = calculateMonthlyBudget(receipts, 2026, 7, new Date("2026-08-01T00:00:00Z"));
    expect(june.total).toBe(20);
    expect(july.total).toBe(0);
  });

  it("returns a zero total for a month with no receipts", () => {
    const summary = calculateMonthlyBudget([], 2025, 3, new Date("2026-08-01T00:00:00Z"));
    expect(summary.total).toBe(0);
  });

  it("excludes flagged (manual_review) receipts from the total", () => {
    const receipts = [
      ...Array.from({ length: 5 }, () => receipt({ transactionDate: "2026-06-10", totalAmount: 10 })),
      receipt({ transactionDate: "2026-06-11", totalAmount: 999, status: "manual_review" }),
    ];
    const summary = calculateMonthlyBudget(receipts, 2026, 6, new Date("2026-08-01T00:00:00Z"));
    expect(summary.total).toBe(50);
  });
});

// Acceptance: prob-1/concept-1/req-9/feature-1 (REQ-13)
describe("calculateMonthlyBudget — exclude manual-review receipts (req-13)", () => {
  it("includes everything when nothing is flagged", () => {
    const receipts = Array.from({ length: 8 }, () => receipt({ transactionDate: "2026-09-05", totalAmount: 5 }));
    const summary = calculateMonthlyBudget(receipts, 2026, 9, new Date("2026-10-01T00:00:00Z"));
    expect(summary.total).toBe(40);
    expect(summary.includedReceiptCount).toBe(8);
  });

  it("excludes flagged receipts from an otherwise valid month", () => {
    const receipts = [
      ...Array.from({ length: 10 }, () => receipt({ transactionDate: "2026-07-05", totalAmount: 10 })),
      ...Array.from({ length: 2 }, () => receipt({ transactionDate: "2026-07-06", totalAmount: 500, status: "manual_review" })),
    ];
    const summary = calculateMonthlyBudget(receipts, 2026, 7, new Date("2026-08-01T00:00:00Z"));
    expect(summary.total).toBe(100);
  });

  it("returns zero when every receipt in the month is flagged", () => {
    const receipts = Array.from({ length: 3 }, () => receipt({ transactionDate: "2026-08-05", totalAmount: 50, status: "manual_review" }));
    const summary = calculateMonthlyBudget(receipts, 2026, 8, new Date("2026-09-01T00:00:00Z"));
    expect(summary.total).toBe(0);
  });
});

// Acceptance: prob-1/concept-1/req-10/feature-1 (REQ-14)
describe("calculateMonthlyBudget — incomplete-month labeling (req-14)", () => {
  it("labels an in-progress month as incomplete", () => {
    const receipts = [receipt({ transactionDate: "2026-07-27" })];
    const summary = calculateMonthlyBudget(receipts, 2026, 7, new Date("2026-07-27T00:00:00Z"));
    expect(summary.incomplete).toBe(true);
  });

  it("does not label a completed month as incomplete", () => {
    const receipts = [receipt({ transactionDate: "2026-06-15" })];
    const summary = calculateMonthlyBudget(receipts, 2026, 6, new Date("2026-08-05T00:00:00Z"));
    expect(summary.incomplete).toBe(false);
  });
});

// Acceptance: prob-1/concept-1/req-21/feature-1 (REQ-25)
describe("calculateMonthlyBudget — report excluded-receipt count (req-25)", () => {
  it("reports zero exclusions when nothing is excluded", () => {
    const receipts = Array.from({ length: 5 }, () => receipt({ transactionDate: "2026-07-05" }));
    const summary = calculateMonthlyBudget(receipts, 2026, 7, new Date("2026-08-01T00:00:00Z"));
    expect(summary.excludedCount).toBe(0);
  });

  it("reports exactly one excluded receipt", () => {
    const receipts = [
      ...Array.from({ length: 5 }, () => receipt({ transactionDate: "2026-07-05" })),
      receipt({ transactionDate: "2026-07-06", status: "manual_review" }),
    ];
    const summary = calculateMonthlyBudget(receipts, 2026, 7, new Date("2026-08-01T00:00:00Z"));
    expect(summary.excludedCount).toBe(1);
  });

  it("reports two excluded receipts", () => {
    const receipts = [
      ...Array.from({ length: 10 }, () => receipt({ transactionDate: "2026-07-05" })),
      ...Array.from({ length: 2 }, () => receipt({ transactionDate: "2026-07-06", status: "manual_review" })),
    ];
    const summary = calculateMonthlyBudget(receipts, 2026, 7, new Date("2026-08-01T00:00:00Z"));
    expect(summary.excludedCount).toBe(2);
  });
});
