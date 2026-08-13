import type { StoredReceipt } from "../receipts/types";

export interface MonthlyBudgetSummary {
  year: number;
  /** 1-12 */
  month: number;
  total: number;
  /** req-14: true while the requested month is the current, in-progress calendar month. */
  incomplete: boolean;
  /** req-25: number of receipts in the month excluded because they require manual review. */
  excludedCount: number;
  includedReceiptCount: number;
}

function isInMonth(receipt: StoredReceipt, year: number, month: number): boolean {
  const date = new Date(receipt.transactionDate + "T00:00:00Z");
  return date.getUTCFullYear() === year && date.getUTCMonth() + 1 === month;
}

/**
 * req-12: aggregates the total of all categorized, non-flagged receipts
 * within the requested calendar month, using each receipt's transaction
 * date (not upload date).
 * req-13: excludes receipts marked "requires manual review" from the total.
 * req-25: reports how many receipts were excluded for that reason.
 * req-14: labels the total as incomplete while the requested month is the
 * current, in-progress calendar month.
 *
 * Design note ("Categorized, non-flagged receipts" is left ambiguous by
 * the baseline's Definitions section): this implementation treats
 * "non-flagged" as "not requires-manual-review" — the only exclusion
 * mechanism any requirement text actually defines (req-13). A receipt
 * with some Uncategorized line items is still summed; only the
 * manual-review status removes it from the total.
 */
export function calculateMonthlyBudget(
  receipts: StoredReceipt[],
  year: number,
  month: number,
  now: Date = new Date()
): MonthlyBudgetSummary {
  const inMonth = receipts.filter((r) => isInMonth(r, year, month));
  const excluded = inMonth.filter((r) => r.status === "manual_review");
  const included = inMonth.filter((r) => r.status !== "manual_review");

  const total = included.reduce((sum, r) => sum + r.totalAmount, 0);

  const incomplete = now.getUTCFullYear() === year && now.getUTCMonth() + 1 === month;

  return {
    year,
    month,
    total,
    incomplete,
    excludedCount: excluded.length,
    includedReceiptCount: included.length,
  };
}
