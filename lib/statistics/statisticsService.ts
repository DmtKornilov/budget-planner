import type { StoredReceipt } from "../receipts/types";
import { UNCATEGORIZED } from "../categorization/categories";

export interface CategoryStat {
  category: string;
  totalSpend: number;
  percentageOfTotal: number;
  transactionCount: number;
}

export interface StatisticsResult {
  hasData: boolean;
  categories: CategoryStat[];
}

function inRange(receipt: StoredReceipt, start: string, end: string): boolean {
  return receipt.transactionDate >= start && receipt.transactionDate <= end;
}

/**
 * req-18: total spend, percentage of overall spend, and transaction count
 * per category for receipts within [start, end] (inclusive, ISO
 * yyyy-mm-dd), ranked highest to lowest spend.
 * req-19: when the range contains no receipts, callers should check
 * `hasData` and inform the user rather than rendering an empty breakdown
 * silently — `categories` is `[]` either way, so `hasData` is what
 * distinguishes "genuinely nothing to show" from "no data for this period".
 *
 * Design note: "transaction count" is counted per line item (one line item
 * = one categorized transaction), since a single receipt can contribute to
 * several categories and the requirement text does not distinguish
 * receipt-count from line-item-count.
 */
export function getCategoryStatistics(
  receipts: StoredReceipt[],
  startDate: string,
  endDate: string
): StatisticsResult {
  const inWindow = receipts.filter((r) => inRange(r, startDate, endDate));

  if (inWindow.length === 0) {
    return { hasData: false, categories: [] };
  }

  const totals = new Map<string, { totalSpend: number; transactionCount: number }>();
  let grandTotal = 0;

  for (const receipt of inWindow) {
    for (const item of receipt.lineItems) {
      const category = item.category ?? UNCATEGORIZED;
      const existing = totals.get(category) ?? { totalSpend: 0, transactionCount: 0 };
      existing.totalSpend += item.totalPrice;
      existing.transactionCount += 1;
      totals.set(category, existing);
      grandTotal += item.totalPrice;
    }
  }

  const categories: CategoryStat[] = [...totals.entries()]
    .map(([category, { totalSpend, transactionCount }]) => ({
      category,
      totalSpend,
      percentageOfTotal: grandTotal === 0 ? 0 : (totalSpend / grandTotal) * 100,
      transactionCount,
    }))
    .sort((a, b) => b.totalSpend - a.totalSpend);

  return { hasData: true, categories };
}
