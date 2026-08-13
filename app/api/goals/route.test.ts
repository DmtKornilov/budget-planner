import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { GET, POST } from "./route";
import { CURRENT_USER_ID } from "@/lib/auth/currentUser";

function goalRequest(body: unknown) {
  return new NextRequest("http://localhost/api/goals", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

// Acceptance: prob-1/concept-1/req-16/feature-1 (REQ-20)
describe("POST /api/goals", () => {
  it("rejects a goal with an invalid type", async () => {
    const response = await POST(goalRequest({ type: "hobby", description: "Learn pottery" }));
    expect(response.status).toBe(400);
  });

  it("rejects a goal with no description", async () => {
    const response = await POST(goalRequest({ type: "financial" }));
    expect(response.status).toBe(400);
  });

  it("stores a financial goal for the current user and returns 201", async () => {
    const response = await POST(goalRequest({ type: "financial", description: "Save 500 PLN" }));
    expect(response.status).toBe(201);
    const goal = await response.json();
    expect(goal.type).toBe("financial");
    expect(goal.userId).toBe(CURRENT_USER_ID);
  });
});

describe("GET /api/goals", () => {
  it("lists goals for the current user", async () => {
    await POST(goalRequest({ type: "lifestyle", description: "Eat out less" }));
    const response = await GET();
    const body = (await response.json()) as { goals: Array<{ userId: string }> };
    expect(body.goals.every((g) => g.userId === CURRENT_USER_ID)).toBe(true);
  });
});
