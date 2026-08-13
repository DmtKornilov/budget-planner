import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { GET, POST } from "./route";
import { receiptStore } from "@/lib/singletons";
import { CURRENT_USER_ID, OTHER_TEST_USER_ID } from "@/lib/auth/currentUser";

function fileFormRequest(fileContent = "fake-bytes", mimeType = "image/jpeg", fileName = "receipt.jpg") {
  const formData = new FormData();
  formData.set("file", new File([fileContent], fileName, { type: mimeType }));
  return new NextRequest("http://localhost/api/receipts", { method: "POST", body: formData });
}

// Acceptance: prob-1/concept-1/req-25/feature-1 (REQ-29 list endpoint) + req-27 isolation at the route layer
describe("GET /api/receipts", () => {
  it("returns only the current user's receipts, not another user's", async () => {
    receiptStore.save({
      userId: OTHER_TEST_USER_ID,
      imageRef: "other.jpg",
      merchant: "Other User Merchant",
      transactionDate: "2026-07-01",
      transactionTime: "10:00",
      lineItems: [],
      totalAmount: 5,
      status: "parsed",
      parserVersion: "v1",
    });

    const response = await GET();
    const body = (await response.json()) as { receipts: Array<{ userId: string }> };
    expect(body.receipts.every((r) => r.userId === CURRENT_USER_ID)).toBe(true);
  });
});

// Acceptance: prob-1/concept-1/req-24/feature-1 (REQ-28, via the real route)
describe("POST /api/receipts — generic error on failure (req-28)", () => {
  it("rejects an unsupported file format with a 400 and a named-formats message", async () => {
    const response = await POST(fileFormRequest("not-an-image", "text/plain"));
    expect(response.status).toBe(400);
    const body = (await response.json()) as { error: string };
    expect(body.error).toContain("JPEG");
  });

  it("digitizes a supported photo and returns 201 with a stored receipt", async () => {
    const response = await POST(fileFormRequest());
    expect(response.status).toBe(201);
    const receipt = await response.json();
    expect(receipt.id).toBeTruthy();
    expect(receipt.userId).toBe(CURRENT_USER_ID);
  });
});
