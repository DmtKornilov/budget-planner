import { MIN_RECEIPTS_FOR_ADVICE } from "../config";

export interface AdviceResult {
  /** req-21: true once there is enough historical data to advise on at all. */
  sufficientData: boolean;
  /** req-21: shown when sufficientData is false. */
  message?: string;
  /** req-26: only present once sufficientData is true — no specific recommendation is generated below the minimum. */
  recommendation?: string;
}

/**
 * req-21: below the configured minimum number of receipts, informs the
 * user more historical data is needed instead of generating advice.
 * req-26: the same insufficient-data condition also withholds any specific
 * recommendation — there is no partial/best-effort recommendation below
 * the minimum.
 */
export function getOptimizationAdvice(
  receiptCount: number,
  minReceipts: number = MIN_RECEIPTS_FOR_ADVICE
): AdviceResult {
  if (receiptCount < minReceipts) {
    return {
      sufficientData: false,
      message: "More historical data is needed before optimization advice can be generated.",
    };
  }

  return {
    sufficientData: true,
    recommendation: "Your spending is well tracked — consider setting a category-specific budget for your highest-spend category.",
  };
}
