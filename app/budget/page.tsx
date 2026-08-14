import { receiptStore } from "@/lib/singletons";
import { CURRENT_USER_ID } from "@/lib/auth/currentUser";
import { calculateMonthlyBudget } from "@/lib/budget/budgetService";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

/**
 * req-30: monthly budget summary screen — shows the month-to-date total
 * (labeled incomplete while the month is in progress) and the count of
 * receipts excluded as requires-manual-review.
 */
export default async function BudgetPage({
  searchParams,
}: {
  searchParams?: Promise<{ year?: string; month?: string }>;
}) {
  const params = await searchParams;
  const now = new Date();
  const year = Number(params?.year ?? now.getUTCFullYear());
  const month = Number(params?.month ?? now.getUTCMonth() + 1);

  const receipts = receiptStore.allForUser(CURRENT_USER_ID);
  const summary = calculateMonthlyBudget(receipts, year, month, now);

  const hasAnyReceipts = summary.includedReceiptCount > 0 || summary.excludedCount > 0;

  return (
    <main>
      <h1>Monthly Budget Summary</h1>
      <h2>
        {year}-{String(month).padStart(2, "0")}
      </h2>

      {!hasAnyReceipts ? (
        <p className={styles.empty}>No receipts recorded for this month yet.</p>
      ) : (
        <div className={styles.card}>
          <p className={styles.total}>
            Total: {summary.total.toFixed(2)}
            {summary.incomplete ? (
              <strong className={styles.incomplete}> (incomplete — month in progress)</strong>
            ) : null}
          </p>
          {summary.excludedCount > 0 ? (
            <p className={styles.excluded}>
              {summary.excludedCount} receipt{summary.excludedCount === 1 ? "" : "s"} excluded pending review.
            </p>
          ) : null}
        </div>
      )}
    </main>
  );
}
