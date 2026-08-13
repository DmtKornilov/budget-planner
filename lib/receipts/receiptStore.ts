import { randomUUID } from "node:crypto";
import type { StoredReceipt } from "./types";
import { encryptAtRest, decryptAtRest } from "../security/encryption";

export type NewReceipt = Omit<StoredReceipt, "id" | "createdAt">;

export interface ReceiptStore {
  save(record: NewReceipt): StoredReceipt;
  get(id: string): StoredReceipt | undefined;
  all(): StoredReceipt[];
  /** req-23 / req-27: only the receipts owned by this user. */
  allForUser(userId: string): StoredReceipt[];
  /** req-27: undefined (not just "not found") when the receipt belongs to a different user. */
  getForUser(id: string, userId: string): StoredReceipt | undefined;
  /** req-10 / req-11: update fields on an existing receipt (e.g. a line item's category). */
  update(id: string, updates: Partial<Omit<StoredReceipt, "id" | "userId" | "createdAt">>): StoredReceipt | undefined;
  /** req-24: remove a receipt so it is immediately excluded from all calculations. */
  delete(id: string): boolean;
  /** req-22: the raw at-rest representation, for inspecting that it is not plaintext. */
  getEncryptedSnapshot(id: string): string | undefined;
}

interface EncryptedRecord {
  id: string;
  userId: string;
  createdAt: string;
  /** req-22: everything else about the receipt, encrypted at rest. */
  cipher: string;
}

type EncryptedPayload = Omit<StoredReceipt, "id" | "userId" | "createdAt">;

/**
 * req-6: persist the extracted receipt with a unique receipt identifier.
 * req-22: encrypted-at-rest placeholder — every field beyond id/userId/
 * createdAt (kept in the clear as index keys, the same way a real database
 * keeps primary keys and partition keys outside column-level encryption)
 * is stored only as ciphertext (see lib/security/encryption.ts) and
 * decrypted on read. req-23: every record carries an owning userId.
 * req-24: delete() removes the record outright so it disappears from
 * every calculation immediately.
 * req-27: getForUser()/allForUser() are the only read paths callers should
 * use once a userId is known, so one user's data is never handed back for
 * another user's request.
 *
 * In-memory placeholder for the Postgres data layer named in the approved
 * concept ([[prob-1/concept-1]]) — see the implementation note's Risks
 * section. Every save() call assigns a fresh id, so a recurring
 * merchant/date/total combination is still stored as a distinct record
 * (duplicate-detection prompting, BRD A14, is not implemented in this slice).
 */
export class InMemoryReceiptStore implements ReceiptStore {
  private readonly receipts = new Map<string, EncryptedRecord>();

  private encode(payload: EncryptedPayload): string {
    return encryptAtRest(JSON.stringify(payload));
  }

  private decode(record: EncryptedRecord): StoredReceipt {
    const payload = JSON.parse(decryptAtRest(record.cipher)) as EncryptedPayload;
    return { id: record.id, userId: record.userId, createdAt: record.createdAt, ...payload };
  }

  save(record: NewReceipt): StoredReceipt {
    const id = randomUUID();
    const createdAt = new Date().toISOString();
    const { userId, ...payload } = record;
    const stored: EncryptedRecord = {
      id,
      userId,
      createdAt,
      cipher: this.encode(payload as EncryptedPayload),
    };
    this.receipts.set(id, stored);
    return this.decode(stored);
  }

  get(id: string): StoredReceipt | undefined {
    const record = this.receipts.get(id);
    return record ? this.decode(record) : undefined;
  }

  all(): StoredReceipt[] {
    return [...this.receipts.values()].map((record) => this.decode(record));
  }

  allForUser(userId: string): StoredReceipt[] {
    return this.all().filter((r) => r.userId === userId);
  }

  getForUser(id: string, userId: string): StoredReceipt | undefined {
    const receipt = this.get(id);
    return receipt && receipt.userId === userId ? receipt : undefined;
  }

  update(
    id: string,
    updates: Partial<Omit<StoredReceipt, "id" | "userId" | "createdAt">>
  ): StoredReceipt | undefined {
    const existing = this.get(id);
    const record = this.receipts.get(id);
    if (!existing || !record) return undefined;

    const merged: StoredReceipt = { ...existing, ...updates };
    const { id: _id, userId, createdAt, ...payload } = merged;
    const updatedRecord: EncryptedRecord = {
      id,
      userId,
      createdAt,
      cipher: this.encode(payload as EncryptedPayload),
    };
    this.receipts.set(id, updatedRecord);
    return this.decode(updatedRecord);
  }

  delete(id: string): boolean {
    return this.receipts.delete(id);
  }

  getEncryptedSnapshot(id: string): string | undefined {
    return this.receipts.get(id)?.cipher;
  }
}
