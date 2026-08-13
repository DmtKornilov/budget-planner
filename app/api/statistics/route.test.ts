import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "./route";
import { receiptStore } from "@/lib/singletons";
import { CURRENT_USER_ID, OTHER_TEST_USER_ID } from "@/lib/auth/currentUser";

function statsRequest(start: string, end: string) {
  return new NextRequest(`http://localhost/api/statistics?start=${start}&end=${end}`);
}

// Acceptance: prob-1/concept-1/req-14/feature-1 (REQ-18/19) + req-23 ownership scoping
describe("GET /api/statistics", () => {
  it("requires start and end query params", async () => {
    const response = await GET(new NextRequest("http://localhost/api/statistics"));
    expect(response.status).toBe(400);
  });

  it("scopes category statistics to the current user only, isolated from another user's data", async () => {
    receiptStore.save({
      userId: CURRENT_USER_ID,
      imageRef: "mine.jpg",
      merchant: "My Market",
      transactionDate: "2026-07-10",
      transactionTime: "10:00",
      lineItems: [{ name: "Bread", quantity: 1, unitPrice: 5, totalPrice: 5, category: "Groceries" }],
      totalAmount: 5,
      status: "parsed",
      parserVersion: "v1",
    });
    receiptStore.save({
      userId: OTHER_TEST_USER_ID,
      imageRef: "other.jpg",
      merchant: "Other Market",
      transactionDate: "2026-07-10",
      transactionTime: "10:00",
      lineItems: [{ name: "Electronics", quantity: 1, unitPrice: 500, totalPrice: 500, category: "Electronics" }],
      totalAmount: 500,
      status: "parsed",
      parserVersion: "v1",
    });

    const response = await GET(statsRequest("2026-07-01", "2026-07-31"));
    const body = (await response.json()) as { hasData: boolean; categories: Array<{ category: string }> };

    expect(body.hasData).toBe(true);
    expect(body.categories.some((c) => c.category === "Electronics")).toBe(false);
    expect(body.categories.some((c) => c.category === "Groceries")).toBe(true);
  });
});
