import { describe, expect, it } from "vitest";
import { comparePositions, compareReceiptPhotos } from "./positionMatching";
import { InMemoryOverrideStore, resolvePairClassification } from "./overrideStore";
import { InMemoryReceiptStore } from "../receipts/receiptStore";
import { calculateMonthlyBudget } from "../budget/budgetService";
import type { LineItem } from "../receipts/types";

function item(overrides: Partial<LineItem> = {}): LineItem {
  return { name: "Bananas 1kg", quantity: 1, unitPrice: 3.2, totalPrice: 3.2, ...overrides };
}

// Acceptance: prob-1/concept-1/req-11/feature-1 (REQ-15)
describe("comparePositions / compareReceiptPhotos — same-position detection (req-15)", () => {
  it("classifies an identical item split across two photos as same position", () => {
    const result = compareReceiptPhotos(
      { parsed: true, lineItems: [item({ name: "Bananas 1kg", unitPrice: 3.2, quantity: 1, totalPrice: 3.2 })] },
      { parsed: true, lineItems: [item({ name: "Bananas 1kg", unitPrice: 3.2, quantity: 1, totalPrice: 3.2 })] }
    );
    expect(result.possible).toBe(true);
    if (result.possible) {
      expect(result.matches[0].result).toBe("same_position");
    }
  });

  it.each([
    [{ name: "Milk 2% 1L" }, { name: "Milk 2.5% 1L" }],
    [{ unitPrice: 4.5 }, { unitPrice: 4.6 }],
    [{ quantity: 1 }, { quantity: 2, totalPrice: 9.0 }],
    [{ totalPrice: 4.5 }, { totalPrice: 4.75 }],
  ])("classifies a single mismatched field as different position", (overridesA, overridesB) => {
    const base = { name: "Milk 2% 1L", unitPrice: 4.5, quantity: 1, totalPrice: 4.5 };
    const a = { ...base, ...overridesA };
    const b = { ...base, ...overridesB };
    expect(comparePositions(a, b)).toBe("different_position");
  });

  it("does not treat a recurring purchase across two distinct receipts as the same position", () => {
    // req-15's matching is defined over two photos of one physical receipt
    // captured together (compareReceiptPhotos), never over two already
    // separately persisted receipts. Two distinct receipts with an
    // identical item are two independent purchases: the store keeps both
    // records and the budget total counts both, it never merges them.
    const store = new InMemoryReceiptStore();
    store.save({
      userId: "dev-user",
      imageRef: "r1.jpg",
      merchant: "Fresh Market",
      transactionDate: "2026-07-01",
      transactionTime: "10:00",
      lineItems: [item({ name: "Milk 2% 1L", unitPrice: 4.5, totalPrice: 4.5 })],
      totalAmount: 4.5,
      status: "parsed",
      parserVersion: "v1",
    });
    store.save({
      userId: "dev-user",
      imageRef: "r2.jpg",
      merchant: "Fresh Market",
      transactionDate: "2026-07-08",
      transactionTime: "10:00",
      lineItems: [item({ name: "Milk 2% 1L", unitPrice: 4.5, totalPrice: 4.5 })],
      totalAmount: 4.5,
      status: "parsed",
      parserVersion: "v1",
    });

    expect(store.all()).toHaveLength(2);
    const summary = calculateMonthlyBudget(store.all(), 2026, 7, new Date("2026-08-01T00:00:00Z"));
    expect(summary.total).toBe(9.0);
    expect(summary.includedReceiptCount).toBe(2);
  });
});

// Acceptance: prob-1/concept-1/req-12/feature-1 (REQ-16)
describe("compareReceiptPhotos — comparison-not-possible on parse failure (req-16)", () => {
  it("returns a normal comparison result when both photos parse successfully", () => {
    const result = compareReceiptPhotos(
      { parsed: true, lineItems: [item()] },
      { parsed: true, lineItems: [item()] }
    );
    expect(result.possible).toBe(true);
  });

  it("returns comparison-not-possible with a parsing-failure reason when one photo fails to parse", () => {
    const result = compareReceiptPhotos({ parsed: false }, { parsed: true, lineItems: [item()] });
    expect(result.possible).toBe(false);
    if (!result.possible) {
      expect(result.reason).toBe("parsing failure");
    }
  });

  it("returns comparison-not-possible with a parsing-failure reason when both photos fail to parse", () => {
    const result = compareReceiptPhotos({ parsed: false }, { parsed: false });
    expect(result.possible).toBe(false);
    if (!result.possible) {
      expect(result.reason).toBe("parsing failure");
    }
  });
});

// Acceptance: prob-1/concept-1/req-13/feature-1 (REQ-17)
describe("manual override of position-match results (req-17)", () => {
  it("overrides an automatic same-position determination to different-position", () => {
    const overrides = new InMemoryOverrideStore();
    overrides.setOverride("pair-1", "different_position");
    expect(resolvePairClassification(overrides, "pair-1", "same_position")).toBe("different_position");
  });

  it("overrides an automatic different-position determination to same-position", () => {
    const overrides = new InMemoryOverrideStore();
    overrides.setOverride("pair-1", "same_position");
    expect(resolvePairClassification(overrides, "pair-1", "different_position")).toBe("same_position");
  });

  it("keeps the manual override across a later automatic re-comparison", () => {
    const overrides = new InMemoryOverrideStore();
    overrides.setOverride("pair-1", "different_position");
    // simulate the automatic matcher re-running and coming back with "same_position" again
    const resolved = resolvePairClassification(overrides, "pair-1", "same_position");
    expect(resolved).toBe("different_position");
  });
});
