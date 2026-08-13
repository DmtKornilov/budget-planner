import type { LineItem, StoredReceipt } from "../receipts/types";
import type { ReceiptStore } from "../receipts/receiptStore";
import type { Categorizer } from "./categorizer";
import type { CorrectionStore } from "./correctionStore";
import { UNCATEGORIZED } from "./categories";
import { CATEGORIZATION_CONFIDENCE_THRESHOLD } from "../config";

/**
 * req-7: assigns a category to every line item on a successfully parsed
 * receipt, from the predefined taxonomy.
 * req-11: a learned correction (same item name, same merchant, exact
 * match) takes priority over the categorizer's own guess.
 * req-9: below the confidence threshold, falls back to Uncategorized and
 * flags the item for user review. req-8: Uncategorized is always a valid
 * assignable category (categorizer.categorize's own fallback already uses
 * it, so "no confident match" and "below threshold" both land there).
 */
export function categorizeReceiptLineItems(
  merchant: string,
  lineItems: LineItem[],
  categorizer: Categorizer,
  corrections: CorrectionStore,
  threshold: number = CATEGORIZATION_CONFIDENCE_THRESHOLD
): LineItem[] {
  return lineItems.map((item) => {
    const learned = corrections.lookup(merchant, item.name);
    if (learned !== undefined) {
      return { ...item, category: learned, categoryFlaggedForReview: false };
    }

    const { category, confidence } = categorizer.categorize(item.name);
    if (confidence < threshold) {
      return { ...item, category: UNCATEGORIZED, categoryFlaggedForReview: true };
    }
    return { ...item, category, categoryFlaggedForReview: false };
  });
}

/**
 * req-10: manually reassign a single line item's category.
 * req-11: recording the correction so it carries forward to future line
 * items with the same name from the same merchant is the caller's
 * responsibility (see reassignLineItemCategory, which does both).
 */
export function reassignLineItem(
  lineItems: LineItem[],
  lineItemIndex: number,
  newCategory: string
): LineItem[] {
  return lineItems.map((item, index) =>
    index === lineItemIndex
      ? { ...item, category: newCategory, categoryFlaggedForReview: false }
      : item
  );
}

/**
 * req-10: reassigns one line item's category on a persisted receipt and
 * writes the change back to the store, so it is visible on a later,
 * separate view.
 * req-11: also records the correction (merchant + item name, exact match)
 * so it is applied automatically to future line items from that merchant.
 */
export function reassignCategoryAndLearn(
  store: ReceiptStore,
  corrections: CorrectionStore,
  receiptId: string,
  lineItemIndex: number,
  newCategory: string
): StoredReceipt | undefined {
  const receipt = store.get(receiptId);
  if (!receipt) return undefined;

  const targetItem = receipt.lineItems[lineItemIndex];
  if (!targetItem) return undefined;

  const updatedLineItems = reassignLineItem(receipt.lineItems, lineItemIndex, newCategory);
  corrections.recordCorrection(receipt.merchant, targetItem.name, newCategory);

  return store.update(receiptId, { lineItems: updatedLineItems });
}
