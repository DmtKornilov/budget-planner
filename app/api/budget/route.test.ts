import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "./route";
import { receiptStore } from "@/lib/singletons";
import { CURRENT_USER_ID } from "@/lib/auth/currentUser";

// Acceptance: prob-1/concept-1/req-26/feature-1 (REQ-30 data source)
describe("GET /api/budget", () => {
  it("returns a monthly summary scoped to the current user", async () => {
    receiptStore.save({
      userId: CURRENT_USER_ID,
      imageRef: "r.jpg",
      merchant: "Fresh Market",
      transactionDate: "2026-05-15",
      transactionTime: "10:00",
      lineItems: [],
      totalAmount: 42,
      status: "parsed",
      parserVersion: "v1",
    });

    const response = await GET(new NextRequest("http://localhost/api/budget?year=2026&month=5"));
    const body = await response.json();
    expect(body.total).toBeGreaterThanOrEqual(42);
    expect(body.year).toBe(2026);
    expect(body.month).toBe(5);
  });
});
