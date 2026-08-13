import { describe, expect, it } from "vitest";
import { InMemoryGoalStore } from "./goalStore";
import { getOptimizationAdvice } from "./adviceService";

// Acceptance: prob-1/concept-1/req-16/feature-1 (REQ-20)
describe("InMemoryGoalStore — define financial or lifestyle goals (req-20)", () => {
  it("stores a financial goal against the user's account", () => {
    const store = new InMemoryGoalStore();
    const goal = store.save({ userId: "dev-user", type: "financial", description: "Save 500 PLN this month" });
    expect(store.listForUser("dev-user")).toContainEqual(goal);
  });

  it("stores a lifestyle goal against the user's account", () => {
    const store = new InMemoryGoalStore();
    const goal = store.save({ userId: "dev-user", type: "lifestyle", description: "Lose weight" });
    expect(store.listForUser("dev-user")).toContainEqual(goal);
  });

  it("stores both goals when a second goal is set while one already exists", () => {
    const store = new InMemoryGoalStore();
    store.save({ userId: "dev-user", type: "financial", description: "Save 500 PLN this month" });
    store.save({ userId: "dev-user", type: "lifestyle", description: "Lose weight" });
    expect(store.listForUser("dev-user")).toHaveLength(2);
  });
});

// Acceptance: prob-1/concept-1/req-17/feature-1 (REQ-21)
describe("getOptimizationAdvice — insufficient-data messaging (req-21)", () => {
  it("returns actual advice once the minimum number of receipts is met", () => {
    const result = getOptimizationAdvice(10, 5);
    expect(result.sufficientData).toBe(true);
    expect(result.message).toBeUndefined();
  });

  it("returns actual advice when the count exactly equals the minimum", () => {
    const result = getOptimizationAdvice(5, 5);
    expect(result.sufficientData).toBe(true);
  });

  it("informs the user more historical data is needed below the minimum", () => {
    const result = getOptimizationAdvice(3, 5);
    expect(result.sufficientData).toBe(false);
    expect(result.message).toBeTruthy();
  });
});

// Acceptance: prob-1/concept-1/req-22/feature-1 (REQ-26)
describe("getOptimizationAdvice — withhold recommendations when data is insufficient (req-26)", () => {
  it("generates a specific recommendation when data is sufficient", () => {
    const result = getOptimizationAdvice(10, 5);
    expect(result.recommendation).toBeTruthy();
  });

  it("generates a specific recommendation when the count exactly meets the minimum", () => {
    const result = getOptimizationAdvice(5, 5);
    expect(result.recommendation).toBeTruthy();
  });

  it("does not generate a specific recommendation below the minimum", () => {
    const result = getOptimizationAdvice(3, 5);
    expect(result.recommendation).toBeUndefined();
  });
});
