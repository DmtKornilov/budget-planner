import type { SupportedFormat } from "./types";

const SUPPORTED_FORMATS: SupportedFormat[] = ["JPEG", "PNG", "HEIC", "PDF-scan"];

const MIME_TO_FORMAT: Record<string, SupportedFormat> = {
  "image/jpeg": "JPEG",
  "image/jpg": "JPEG",
  "image/png": "PNG",
  "image/heic": "HEIC",
  "application/pdf": "PDF-scan",
};

export class UnsupportedFormatError extends Error {
  constructor() {
    super(
      `Unsupported file format. Accepted formats: ${SUPPORTED_FORMATS.join(", ")}.`
    );
    this.name = "UnsupportedFormatError";
  }
}

/**
 * req-1: validate the file is a supported format before processing.
 * req-2: if unsupported, reject with an error naming the accepted formats.
 */
export function validateFormat(mimeType: string): SupportedFormat {
  const format = MIME_TO_FORMAT[mimeType.toLowerCase()];
  if (!format) {
    throw new UnsupportedFormatError();
  }
  return format;
}

export { SUPPORTED_FORMATS };
