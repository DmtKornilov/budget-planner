import { describe, expect, it } from "vitest";
import { parseReceipt, getLowConfidenceFields, getMissingRequiredFields } from "./parseReceipt";
import type { OcrResult } from "./ocrProvider";

function ocrResult(overrides: Partial<OcrResult> = {}): OcrResult {
  return {
    merchantName: "Fresh Market",
    transactionDate: "2026-07-20",
    transactionTime: "10:00",
    lineItems: [],
    totalAmount: 10,
    ...overrides,
  };
}

describe("getLowConfidenceFields (req-4)", () => {
  it("does not flag a field with no confidence entry", () => {
    expect(getLowConfidenceFields(ocrResult())).toEqual([]);
  });

  it("does not flag a field above the threshold", () => {
    const result = ocrResult({ fieldConfidence: { totalAmount: 0.9 } });
    expect(getLowConfidenceFields(result, 0.7)).not.toContain("totalAmount");
  });

  it("does not flag a field exactly at the threshold", () => {
    const result = ocrResult({ fieldConfidence: { merchantName: 0.7 } });
    expect(getLowConfidenceFields(result, 0.7)).not.toContain("merchantName");
  });

  it("flags a field below the threshold", () => {
    const result = ocrResult({ fieldConfidence: { totalAmount: 0.3 } });
    expect(getLowConfidenceFields(result, 0.7)).toContain("totalAmount");
  });
});

describe("getMissingRequiredFields (req-5)", () => {
  it("reports no missing fields when both total and date are present", () => {
    expect(getMissingRequiredFields(ocrResult())).toEqual([]);
  });

  it("reports totalAmount missing when it is NaN", () => {
    expect(getMissingRequiredFields(ocrResult({ totalAmount: NaN }))).toEqual(["totalAmount"]);
  });

  it("reports transactionDate missing when it is blank", () => {
    expect(getMissingRequiredFields(ocrResult({ transactionDate: "" }))).toEqual(["transactionDate"]);
  });

  it("reports both fields missing exactly once each", () => {
    const missing = getMissingRequiredFields(ocrResult({ totalAmount: NaN, transactionDate: "" }));
    expect(missing).toEqual(["totalAmount", "transactionDate"]);
  });
});

describe("parseReceipt", () => {
  it("carries lowConfidenceFields through onto the extracted receipt", () => {
    const extracted = parseReceipt(ocrResult({ fieldConfidence: { totalAmount: 0.1 } }));
    expect(extracted.lowConfidenceFields).toContain("totalAmount");
  });
});
