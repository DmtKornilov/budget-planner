"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import styles from "./LineItemCategoryEditor.module.css";

interface Props {
  receiptId: string;
  lineItemIndex: number;
  currentCategory: string;
  categories: readonly string[];
}

/**
 * req-29: lets the user manually reassign a line item's category from the
 * receipt list screen. req-10 / req-11 are enforced server-side by the
 * PATCH /api/receipts/[id] route (lib/categorization/categorizeReceipt.ts's
 * reassignCategoryAndLearn).
 */
export function LineItemCategoryEditor({ receiptId, lineItemIndex, currentCategory, categories }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const category = event.target.value;
    setError(null);
    try {
      const response = await fetch(`/api/receipts/${receiptId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lineItemIndex, category }),
      });
      if (!response.ok) {
        throw new Error("Failed to update category.");
      }
      startTransition(() => router.refresh());
    } catch {
      setError("Could not save the category change. Please try again.");
    }
  }

  return (
    <span>
      <select
        aria-label={`Category for line item ${lineItemIndex}`}
        value={currentCategory}
        onChange={handleChange}
        disabled={isPending}
        className={styles.select}
      >
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
      {error ? (
        <span role="alert" className={styles.error}>
          {error}
        </span>
      ) : null}
    </span>
  );
}
