import { describe, expect, it } from "vitest";
import { validateFormat, UnsupportedFormatError } from "./validateFormat";

// Acceptance: prob-1/concept-1/req-1/feature-1
describe("validateFormat — accept each supported format (req-1)", () => {
  it.each([
    ["image/jpeg", "JPEG"],
    ["image/png", "PNG"],
    ["image/heic", "HEIC"],
    ["application/pdf", "PDF-scan"],
  ])("accepts %s as %s", (mimeType, expectedFormat) => {
    expect(validateFormat(mimeType)).toBe(expectedFormat);
  });
});

// Acceptance: prob-1/concept-1/req-2/feature-1
describe("validateFormat — reject unsupported file formats (req-2)", () => {
  it("rejects a clearly unsupported format and names the accepted formats", () => {
    expect(() =>
      validateFormat(
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      )
    ).toThrow(UnsupportedFormatError);

    try {
      validateFormat("text/plain");
    } catch (error) {
      expect((error as Error).message).toContain("JPEG");
      expect((error as Error).message).toContain("PNG");
      expect((error as Error).message).toContain("HEIC");
      expect((error as Error).message).toContain("PDF-scan");
    }
  });

  it("rejects a file with no recognizable format", () => {
    expect(() => validateFormat("")).toThrow(UnsupportedFormatError);
  });
});
