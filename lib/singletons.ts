import { InMemoryReceiptStore } from "./receipts/receiptStore";
import { MockOcrProvider } from "./receipts/ocrProvider";
import { MockCategorizer } from "./categorization/categorizer";
import { InMemoryCorrectionStore } from "./categorization/correctionStore";
import { InMemoryGoalStore } from "./goals/goalStore";
import { InMemoryOverrideStore } from "./positionMatching/overrideStore";

/**
 * Process-lifetime singletons shared by every API route and server
 * component — the same "one in-memory store for the process" placeholder
 * proc-1 established (see app/api/receipts/route.ts's original comment).
 * Everything here is a mock/in-memory stand-in for real infrastructure;
 * see each module's own doc comment for what it stands in for.
 *
 * Routes and pages must import the shared instances from here rather than
 * constructing their own, or the UI screens (req-29, req-30) and the API
 * routes would silently diverge on two separate in-memory stores.
 *
 * Stashed on `globalThis` rather than as plain module-level `const`s:
 * Next.js/Turbopack compiles route handlers and page server components as
 * separate bundled entry points and does not guarantee they share one
 * module instance, even within a single dev server process — verified by
 * hand (a receipt POSTed via the API route was invisible to the /receipts
 * page's direct store read until this fix). `globalThis` is the one thing
 * genuinely shared across every bundle in the same Node.js process, which
 * is the standard Next.js workaround for this class of bug (the same
 * pattern commonly used to cache a Prisma Client instance across dev
 * recompilations).
 */
declare global {
  // eslint-disable-next-line no-var
  var __budgetPlannerSingletons:
    | {
        receiptStore: InMemoryReceiptStore;
        ocrProvider: MockOcrProvider;
        categorizer: MockCategorizer;
        correctionStore: InMemoryCorrectionStore;
        goalStore: InMemoryGoalStore;
        positionOverrideStore: InMemoryOverrideStore;
      }
    | undefined;
}

const singletons =
  globalThis.__budgetPlannerSingletons ??
  (globalThis.__budgetPlannerSingletons = {
    receiptStore: new InMemoryReceiptStore(),
    ocrProvider: new MockOcrProvider({
      merchantName: "Sample Merchant",
      transactionDate: new Date().toISOString().slice(0, 10),
      transactionTime: "12:00",
      lineItems: [{ name: "Sample Item", quantity: 1, unitPrice: 1, totalPrice: 1 }],
      totalAmount: 1,
    }),
    categorizer: new MockCategorizer(),
    correctionStore: new InMemoryCorrectionStore(),
    goalStore: new InMemoryGoalStore(),
    positionOverrideStore: new InMemoryOverrideStore(),
  });

export const receiptStore = singletons.receiptStore;
export const ocrProvider = singletons.ocrProvider;
export const categorizer = singletons.categorizer;
export const correctionStore = singletons.correctionStore;
export const goalStore = singletons.goalStore;
export const positionOverrideStore = singletons.positionOverrideStore;
