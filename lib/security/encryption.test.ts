import { describe, expect, it } from "vitest";
import { encryptAtRest, decryptAtRest } from "./encryption";

// Acceptance: prob-1/concept-1/req-18/feature-1 (encryption at rest)
describe("encryptAtRest / decryptAtRest (req-22)", () => {
  it("round-trips plaintext through encrypt then decrypt", () => {
    const plaintext = JSON.stringify({ merchant: "Fresh Market", totalAmount: 84.5 });
    const ciphertext = encryptAtRest(plaintext);
    expect(decryptAtRest(ciphertext)).toBe(plaintext);
  });

  it("does not store the plaintext merchant name or amount inside the ciphertext", () => {
    const plaintext = JSON.stringify({ merchant: "Fresh Market", totalAmount: 84.5 });
    const ciphertext = encryptAtRest(plaintext);
    expect(ciphertext).not.toContain("Fresh Market");
    expect(ciphertext).not.toContain("84.5");
    expect(ciphertext).not.toBe(plaintext);
  });

  it("produces different ciphertext for different plaintext", () => {
    const a = encryptAtRest("receipt-a");
    const b = encryptAtRest("receipt-b");
    expect(a).not.toBe(b);
  });
});
