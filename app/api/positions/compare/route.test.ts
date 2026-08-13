import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "./route";

function compareRequest(body: unknown) {
  return new NextRequest("http://localhost/api/positions/compare", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

const item = { name: "Milk", quantity: 1, unitPrice: 3, totalPrice: 3 };

// Acceptance: prob-1/concept-1/req-11/feature-1 (REQ-15) + req-12/feature-1 (REQ-16)
describe("POST /api/positions/compare", () => {
  it("rejects a request missing either photo", async () => {
    const response = await POST(compareRequest({ photoA: { parsed: true, lineItems: [] } }));
    expect(response.status).toBe(400);
  });

  it("returns comparison-not-possible when a photo failed to parse", async () => {
    const response = await POST(
      compareRequest({
        photoA: { parsed: false },
        photoB: { parsed: true, lineItems: [item] },
      })
    );
    const body = await response.json();
    expect(body.possible).toBe(false);
    expect(body.reason).toBe("parsing failure");
  });

  it("classifies an identical item split across two photos as same position", async () => {
    const response = await POST(
      compareRequest({
        photoA: { parsed: true, lineItems: [item] },
        photoB: { parsed: true, lineItems: [item] },
      })
    );
    const body = await response.json();
    expect(body.possible).toBe(true);
    expect(body.matches[0].result).toBe("same_position");
  });
});
