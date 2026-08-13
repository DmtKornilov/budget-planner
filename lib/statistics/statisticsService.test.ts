import { describe, expect, it } from "vitest";
import { getCategoryStatistics } from "./statisticsService";
import type { StoredReceipt } from "../receipts/types";

function receipt(overrides: Partial<StoredReceipt> = {}): StoredReceipt {
  return {
    id: "r-" + Math.random(),
    userId: "dev-user",
    imageRef: "receipt.jpg",
    merchant: "Fresh Market",
    transactionDate: "2026-07-15",
    transactionTime: "10:00",
    lineItems: [],
    totalAmount: 10,
    status: "parsed",
    parserVersion: "v1",
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

// Acceptance: prob-1/concept-1/req-14/feature-1 (REQ-18)
describe("getCategoryStatistics — ranked category statistics (req-18)", () => {
  it("returns total spend, percentage share, and transaction count per category, ranked descending", () => {
    const receipts = [
      receipt({
        transactionDate: "2026-07-05",
        lineItems: [
          { name: "Bananas", quantity: 1, unitPrice: 3, totalPrice: 3, category: "Groceries" },
          { name: "Bus", quantity: 1, unitPrice: 1, totalPrice: 1, category: "Transportation" },
        ],
      }),
      receipt({
        transactionDate: "2026-07-20",
        lineItems: [{ name: "Milk", quantity: 1, unitPrice: 9, totalPrice: 9, category: "Groceries" }],
      }),
    ];

    const result = getCategoryStatistics(receipts, "2026-07-01", "2026-07-31");

    expect(result.hasData).toBe(true);
    expect(result.categories[0]).toMatchObject({ category: "Groceries", totalSpend: 12, transactionCount: 2 });
    expect(result.categories[1]).toMatchObject({ category: "Transportation", totalSpend: 1, transactionCount: 1 });
    expect(result.categories[0].percentageOfTotal).toBeCloseTo(92.3, 1);
  });

  it("limits totals to a custom date range", () => {
    const receipts = [
      receipt({ transactionDate: "2026-07-12", lineItems: [{ name: "In range", quantity: 1, unitPrice: 5, totalPrice: 5, category: "Groceries" }] }),
      receipt({ transactionDate: "2026-06-30", lineItems: [{ name: "Out of range", quantity: 1, unitPrice: 99, totalPrice: 99, category: "Groceries" }] }),
    ];

    const result = getCategoryStatistics(receipts, "2026-07-10", "2026-07-24");

    expect(result.categories).toHaveLength(1);
    expect(result.categories[0].totalSpend).toBe(5);
  });

  it("returns an empty breakdown without an error when the range has no receipts", () => {
    const result = getCategoryStatistics([], "2026-08-01", "2026-08-07");
    expect(result.categories).toEqual([]);
  });
});

// Acceptance: prob-1/concept-1/req-15/feature-1 (REQ-19)
describe("getCategoryStatistics — no-data messaging (req-19)", () => {
  it("reports data available for a period with receipts", () => {
    const receipts = [
      receipt({ transactionDate: "2026-06-10", lineItems: [{ name: "X", quantity: 1, unitPrice: 1, totalPrice: 1, category: "Groceries" }] }),
    ];
    const result = getCategoryStatistics(receipts, "2026-06-01", "2026-06-30");
    expect(result.hasData).toBe(true);
  });

  it("reports data available for a period with exactly one receipt", () => {
    const receipts = [
      receipt({ transactionDate: "2026-04-15", lineItems: [{ name: "X", quantity: 1, unitPrice: 1, totalPrice: 1, category: "Groceries" }] }),
    ];
    const result = getCategoryStatistics(receipts, "2026-04-01", "2026-04-30");
    expect(result.hasData).toBe(true);
  });

  it("informs the caller no receipts were found for a period with no data", () => {
    const result = getCategoryStatistics([], "2025-03-01", "2025-03-31");
    expect(result.hasData).toBe(false);
  });
});
