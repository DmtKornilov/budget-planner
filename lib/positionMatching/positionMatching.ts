import type { LineItem } from "../receipts/types";

export type PositionMatchResult = "same_position" | "different_position";

export interface ParsedPhoto {
  parsed: boolean;
  lineItems?: LineItem[];
}

export interface ComparisonPossible {
  possible: true;
  matches: Array<{ itemA: LineItem; itemB: LineItem; result: PositionMatchResult }>;
}

export interface ComparisonNotPossible {
  possible: false;
  reason: "parsing failure";
}

export type ComparisonResult = ComparisonPossible | ComparisonNotPossible;

/**
 * req-15: two line items are the "same position" only if item name, unit
 * price, quantity, and total price all match exactly. Any single mismatch
 * makes them "different position".
 */
export function comparePositions(a: LineItem, b: LineItem): PositionMatchResult {
  const same =
    a.name === b.name &&
    a.unitPrice === b.unitPrice &&
    a.quantity === b.quantity &&
    a.totalPrice === b.totalPrice;
  return same ? "same_position" : "different_position";
}

/**
 * req-16: if either photo failed to parse, comparison is not possible and
 * the reason is the parsing failure — never a silent/partial comparison.
 * Otherwise, pairs up line items by index and classifies each pair
 * (req-15).
 */
export function compareReceiptPhotos(photoA: ParsedPhoto, photoB: ParsedPhoto): ComparisonResult {
  if (!photoA.parsed || !photoB.parsed) {
    return { possible: false, reason: "parsing failure" };
  }

  const itemsA = photoA.lineItems ?? [];
  const itemsB = photoB.lineItems ?? [];
  const length = Math.max(itemsA.length, itemsB.length);
  const matches: ComparisonPossible["matches"] = [];

  for (let i = 0; i < length; i++) {
    const itemA = itemsA[i];
    const itemB = itemsB[i];
    if (!itemA || !itemB) continue;
    matches.push({ itemA, itemB, result: comparePositions(itemA, itemB) });
  }

  return { possible: true, matches };
}
