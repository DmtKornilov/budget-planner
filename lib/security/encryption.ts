/**
 * req-22: encryption-at-rest placeholder.
 *
 * There is no real KMS or encryption-at-rest infrastructure in this process
 * (see the approved concept, [[prob-1/concept-1]] Constraints — "no real
 * Postgres persistence... in this process"). Real infrastructure (e.g. a
 * cloud KMS envelope-encryption scheme, or Postgres column/tablespace
 * encryption) will replace this module later. This is a documented,
 * clearly-labeled stand-in: it performs a real, reversible transform (a
 * fixed-key XOR cipher over UTF-8 bytes, base64-encoded) so that what is
 * actually stored in InMemoryReceiptStore is not the plaintext receipt
 * payload — the req-22 acceptance scenarios ("the stored ... data should be
 * encrypted at rest") can be exercised against real stored bytes, not a
 * no-op. It provides no real cryptographic security (fixed key, XOR is not
 * a secure cipher) and must not be treated as one.
 */

// Placeholder-only fixed key. A real implementation would source this from
// a KMS-managed secret, never a source-controlled constant.
const PLACEHOLDER_KEY = "budget-planner-at-rest-placeholder-key";

function xor(input: Buffer, key: string): Buffer {
  const keyBytes = Buffer.from(key, "utf8");
  const output = Buffer.alloc(input.length);
  for (let i = 0; i < input.length; i++) {
    output[i] = input[i] ^ keyBytes[i % keyBytes.length];
  }
  return output;
}

/** Encrypts (placeholder cipher) a plaintext string for storage. */
export function encryptAtRest(plaintext: string): string {
  const cipherBytes = xor(Buffer.from(plaintext, "utf8"), PLACEHOLDER_KEY);
  return cipherBytes.toString("base64");
}

/** Decrypts (placeholder cipher) a value previously produced by encryptAtRest. */
export function decryptAtRest(ciphertext: string): string {
  const cipherBytes = Buffer.from(ciphertext, "base64");
  const plainBytes = xor(cipherBytes, PLACEHOLDER_KEY);
  return plainBytes.toString("utf8");
}
