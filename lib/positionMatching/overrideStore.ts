import type { PositionMatchResult } from "./positionMatching";

/**
 * req-17: lets the user manually override an automatic same-position /
 * different-position determination, and remembers that override so a later
 * automatic re-comparison for the same pair does not silently overwrite it.
 */
export interface OverrideStore {
  setOverride(pairId: string, result: PositionMatchResult): void;
  getOverride(pairId: string): PositionMatchResult | undefined;
}

export class InMemoryOverrideStore implements OverrideStore {
  private readonly overrides = new Map<string, PositionMatchResult>();

  setOverride(pairId: string, result: PositionMatchResult): void {
    this.overrides.set(pairId, result);
  }

  getOverride(pairId: string): PositionMatchResult | undefined {
    return this.overrides.get(pairId);
  }
}

/**
 * req-17: the classification a caller should treat as authoritative for a
 * pair — the stored manual override if one exists, otherwise the automatic
 * result. Re-running the automatic comparison (`automaticResult`) never
 * overwrites a recorded override.
 */
export function resolvePairClassification(
  overrides: OverrideStore,
  pairId: string,
  automaticResult: PositionMatchResult
): PositionMatchResult {
  return overrides.getOverride(pairId) ?? automaticResult;
}
