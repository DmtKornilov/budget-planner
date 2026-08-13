import { CATEGORY_TAXONOMY, UNCATEGORIZED } from "./categories";
import { ExternalApiError } from "../errors";

export interface CategorizationResult {
  category: string;
  confidence: number;
}

/**
 * Abstraction over the LLM-based categorization named in the approved
 * concept ([[prob-1/concept-1]]). No real LLM API is wired up in this
 * process — MockCategorizer stands in with simple keyword rules, the same
 * way MockOcrProvider stands in for a real OCR API.
 */
export interface Categorizer {
  categorize(itemName: string): CategorizationResult;
}

/** Keyword → category rules, confidence 1 (a clean keyword hit). */
const KEYWORD_RULES: Array<{ category: string; keywords: string[] }> = [
  {
    category: "Groceries",
    keywords: [
      "banana", "milk", "bread", "egg", "coffee", "grocery", "groceries",
      "vegetable", "fruit", "cheese", "rice", "pasta", "meat", "chicken",
    ],
  },
  {
    category: "Transportation",
    keywords: ["bus", "taxi", "uber", "lyft", "train", "fuel", "gas", "parking", "metro", "ticket"],
  },
  {
    category: "Dining",
    keywords: ["restaurant", "meal", "cafe", "coffee shop", "burger", "pizza", "diner", "bistro"],
  },
  {
    category: "Entertainment",
    keywords: ["movie", "cinema", "concert", "game", "streaming", "theater"],
  },
  {
    category: "Household",
    keywords: ["detergent", "cleaning", "furniture", "appliance", "towel", "supplies"],
  },
  {
    category: "Health",
    keywords: ["pharmacy", "medicine", "vitamin", "doctor", "clinic", "prescription"],
  },
  {
    category: "Utilities",
    keywords: ["electric", "water bill", "internet", "phone bill", "utility"],
  },
];

/**
 * req-7: assigns a category from the predefined taxonomy when a keyword
 * match is found (confidence 1).
 * req-8 / req-9: falls back to Uncategorized with low confidence (0) when
 * nothing matches, so the caller's confidence-threshold check routes it to
 * Uncategorized and flags it for review.
 */
export class MockCategorizer implements Categorizer {
  /**
   * @param failure req-28: when set, categorize() throws this error instead
   *   of returning a result, simulating an LLM/categorization API failure/timeout.
   */
  constructor(private readonly failure?: ExternalApiError) {}

  categorize(itemName: string): CategorizationResult {
    if (this.failure) {
      throw this.failure;
    }
    const normalized = itemName.toLowerCase();
    for (const rule of KEYWORD_RULES) {
      if (rule.keywords.some((keyword) => normalized.includes(keyword))) {
        return { category: rule.category, confidence: 1 };
      }
    }
    return { category: UNCATEGORIZED, confidence: 0 };
  }
}

export { CATEGORY_TAXONOMY, UNCATEGORIZED };
