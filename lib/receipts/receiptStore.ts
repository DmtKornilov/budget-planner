import { randomUUID } from "node:crypto";
import type { StoredReceipt } from "./types";

export type NewReceipt = Omit<StoredReceipt, "id" | "createdAt">;

export interface ReceiptStore {
  save(record: NewReceipt): StoredReceipt;
  get(id: string): StoredReceipt | undefined;
  all(): StoredReceipt[];
}

/**
 * req-6: persist the extracted receipt with a unique receipt identifier.
 *
 * In-memory placeholder for the Postgres data layer named in the approved
 * concept ([[prob-1/concept-1]]) — see the implementation note's Risks
 * section. Every save() call assigns a fresh id, so a recurring
 * merchant/date/total combination is still stored as a distinct record
 * (duplicate-detection prompting, BRD A14, is not implemented in this slice).
 */
export class InMemoryReceiptStore implements ReceiptStore {
  private readonly receipts = new Map<string, StoredReceipt>();

  save(record: NewReceipt): StoredReceipt {
    const stored: StoredReceipt = {
      ...record,
      id: randomUUID(),
      createdAt: new Date().toISOString(),
    };
    this.receipts.set(stored.id, stored);
    return stored;
  }

  get(id: string): StoredReceipt | undefined {
    return this.receipts.get(id);
  }

  all(): StoredReceipt[] {
    return [...this.receipts.values()];
  }
}
