import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "./route";

function overrideRequest(body: unknown) {
  return new NextRequest("http://localhost/api/positions/override", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

// Acceptance: prob-1/concept-1/req-13/feature-1 (REQ-17)
describe("POST /api/positions/override", () => {
  it("rejects a request missing pairId or result", async () => {
    const response = await POST(overrideRequest({ pairId: "pair-1" }));
    expect(response.status).toBe(400);
  });

  it("rejects a result value that isn't a valid classification", async () => {
    const response = await POST(overrideRequest({ pairId: "pair-1", result: "maybe" }));
    expect(response.status).toBe(400);
  });

  it("stores a valid override and echoes it back", async () => {
    const response = await POST(overrideRequest({ pairId: "pair-1", result: "same_position" }));
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toEqual({ pairId: "pair-1", result: "same_position" });
  });
});
