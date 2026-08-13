import { randomUUID } from "node:crypto";

/**
 * req-20: neither "financial" nor "lifestyle" is formally defined by the
 * requirements baseline beyond example (a savings target vs. a behavior
 * change like losing weight) — implemented as a two-value union with no
 * further validation distinguishing them, per this stage's recorded
 * decision (see `unclear-requirements`).
 */
export type GoalType = "financial" | "lifestyle";

export interface Goal {
  id: string;
  userId: string;
  type: GoalType;
  description: string;
  createdAt: string;
}

export type NewGoal = Omit<Goal, "id" | "createdAt">;

export interface GoalStore {
  save(goal: NewGoal): Goal;
  listForUser(userId: string): Goal[];
}

/**
 * req-20: a user may define any number of goals; a second goal does not
 * replace the first (baseline's Open questions leaves "multiple/replacement
 * goals" undecided — additive storage is the conservative default that
 * discards nothing).
 */
export class InMemoryGoalStore implements GoalStore {
  private readonly goals = new Map<string, Goal>();

  save(goal: NewGoal): Goal {
    const stored: Goal = { ...goal, id: randomUUID(), createdAt: new Date().toISOString() };
    this.goals.set(stored.id, stored);
    return stored;
  }

  listForUser(userId: string): Goal[] {
    return [...this.goals.values()].filter((g) => g.userId === userId);
  }
}
