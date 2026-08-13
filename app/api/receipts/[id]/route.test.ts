import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { GET, PATCH, DELETE } from "./route";
import { receiptStore } from "@/lib/singletons";
import { CURRENT_USER_ID, OTHER_TEST_USER_ID } from "@/lib/auth/currentUser";

function params(id: string) {
  return { params: Promise.resolve({ id }) };
}

function saveReceipt(overrides: Partial<Parameters<typeof receiptStore.save>[0]> = {}) {
  return receiptStore.save({
    userId: CURRENT_USER_ID,
    imageRef: "receipt.jpg",
    merchant: "FitMart",
    transactionDate: "2026-07-01",
    transactionTime: "10:00",
    lineItems: [{ name: "Protein Bar XL", quantity: 1, unitPrice: 3.2, totalPrice: 3.2, category: "Groceries" }],
    totalAmount: 3.2,
    status: "parsed",
    parserVersion: "v1",
    ...overrides,
  });
}

// Acceptance: prob-1/concept-1/req-23/feature-1 (REQ-27)
describe("GET /api/receipts/[id] — deny direct cross-user access (req-27)", () => {
  it("returns the receipt for its owning user", async () => {
    const receipt = saveReceipt();
    const response = await GET(new NextRequest("http://localhost/api/receipts/x"), params(receipt.id));
    expect(response.status).toBe(200);
  });

  it("denies access when a different user requests it", async () => {
    const receipt = receiptStore.save({
      userId: OTHER_TEST_USER_ID,
      imageRef: "b.jpg",
      merchant: "B's Merchant",
      transactionDate: "2026-07-01",
      transactionTime: "10:00",
      lineItems: [],
      totalAmount: 5,
      status: "parsed",
      parserVersion: "v1",
    });

    const response = await GET(new NextRequest("http://localhost/api/receipts/x"), params(receipt.id));
    expect(response.status).toBe(404);
  });
});

// Acceptance: prob-1/concept-1/req-25/feature-1 (REQ-29 reassignment through the screen's API)
describe("PATCH /api/receipts/[id] — manual category reassignment (req-10, req-11)", () => {
  it("reassigns the category and it persists on a later GET", async () => {
    const receipt = saveReceipt();
    const patchReq = new NextRequest(`http://localhost/api/receipts/${receipt.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lineItemIndex: 0, category: "Health" }),
    });

    const patchResponse = await PATCH(patchReq, params(receipt.id));
    expect(patchResponse.status).toBe(200);

    const getResponse = await GET(new NextRequest("http://localhost/api/receipts/x"), params(receipt.id));
    const body = await getResponse.json();
    expect(body.lineItems[0].category).toBe("Health");
  });
});

// Acceptance: prob-1/concept-1/req-20/feature-1 (REQ-24, via the real route)
describe("DELETE /api/receipts/[id] — immediate-effect deletion (req-24)", () => {
  it("removes the receipt so a subsequent GET 404s", async () => {
    const receipt = saveReceipt();
    const deleteResponse = await DELETE(new NextRequest("http://localhost/api/receipts/x"), params(receipt.id));
    expect(deleteResponse.status).toBe(200);

    const getResponse = await GET(new NextRequest("http://localhost/api/receipts/x"), params(receipt.id));
    expect(getResponse.status).toBe(404);
  });

  it("denies deleting another user's receipt", async () => {
    const receipt = receiptStore.save({
      userId: OTHER_TEST_USER_ID,
      imageRef: "b.jpg",
      merchant: "B's Merchant",
      transactionDate: "2026-07-01",
      transactionTime: "10:00",
      lineItems: [],
      totalAmount: 5,
      status: "parsed",
      parserVersion: "v1",
    });

    const response = await DELETE(new NextRequest("http://localhost/api/receipts/x"), params(receipt.id));
    expect(response.status).toBe(404);
    expect(receiptStore.get(receipt.id)).toBeDefined();
  });
});
