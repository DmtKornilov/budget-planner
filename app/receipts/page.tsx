import { receiptStore } from "@/lib/singletons";
import { CURRENT_USER_ID } from "@/lib/auth/currentUser";
import { CATEGORY_TAXONOMY, UNCATEGORIZED } from "@/lib/categorization/categories";
import { LineItemCategoryEditor } from "./LineItemCategoryEditor";

// Read from the shared in-memory store on every request — a stub for a
// real user session/data layer, not a page that should ever be statically
// cached with someone else's data.
export const dynamic = "force-dynamic";

/**
 * req-29: receipt list screen — shows each digitized receipt's line items
 * with their assigned category, and lets the user reassign a line item's
 * category from the screen.
 */
export default function ReceiptsPage() {
  const receipts = receiptStore.allForUser(CURRENT_USER_ID);

  return (
    <main>
      <h1>Receipts</h1>

      {receipts.length === 0 ? (
        <p>No receipts yet. Digitize a receipt to see it here.</p>
      ) : (
        receipts.map((receipt) => (
          <section key={receipt.id} aria-label={`Receipt from ${receipt.merchant}`}>
            <h2>
              {receipt.merchant} — {receipt.transactionDate}
              {receipt.status === "manual_review" ? " (requires manual review)" : ""}
            </h2>
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Total</th>
                  <th>Category</th>
                </tr>
              </thead>
              <tbody>
                {receipt.lineItems.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.totalPrice.toFixed(2)}</td>
                    <td>
                      {item.category ?? UNCATEGORIZED}
                      <LineItemCategoryEditor
                        receiptId={receipt.id}
                        lineItemIndex={index}
                        currentCategory={item.category ?? UNCATEGORIZED}
                        categories={CATEGORY_TAXONOMY}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        ))
      )}
    </main>
  );
}
