/**
 * req-7 / req-8: the predefined category taxonomy. Its actual contents are
 * not defined anywhere in the requirements/acceptance artifacts (see the
 * baseline's Definitions section — "assumed to be a business/configuration
 * input"). This is a reasonable fixed default list, not a requirements
 * decision to relitigate.
 */
export const UNCATEGORIZED = "Uncategorized";

export const CATEGORY_TAXONOMY: readonly string[] = [
  "Groceries",
  "Dining",
  "Transportation",
  "Entertainment",
  "Household",
  "Health",
  "Utilities",
  UNCATEGORIZED,
];
