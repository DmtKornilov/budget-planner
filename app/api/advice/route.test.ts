import { describe, expect, it } from "vitest";
import { GET } from "./route";
import { receiptStore } from "@/lib/singletons";
import { CURRENT_USER_ID } from "@/lib/auth/currentUser";

function saveReceipt() {
  return receiptStore.save({
    userId: CURRENT_USER_ID,
    imageRef: "r.jpg",
    merchant: "Market",
    transactionDate: "2026-07-01",
    transactionTime: "10:00",
    lineItems: [],
    totalAmount: 10,
    status: "parsed",
    parserVersion: "v1",
  });
}

// Acceptance: prob-1/concept-1/req-17/feature-1 (REQ-21) + req-22/feature-1 (REQ-26)
describe("GET /api/advice", () => {
  it("informs the user more data is needed when below the configured minimum", async () => {
    const response = await GET();
    const body = await response.json();
    expect(body.sufficientData).toBe(false);
    expect(body.recommendation).toBeUndefined();
  });

  it("returns a specific recommendation once the minimum number of receipts is met", async () => {
    for (let i = 0; i < 5; i++) saveReceipt();
    const response = await GET();
    const body = await response.json();
    expect(body.sufficientData).toBe(true);
    expect(body.recommendation).toBeTruthy();
  });
});
