import { NextRequest, NextResponse } from "next/server";
import { digitizeReceipt } from "@/lib/receipts/digitizeReceipt";
import { UnsupportedFormatError } from "@/lib/receipts/validateFormat";
import { ExternalApiError } from "@/lib/errors";
import { CURRENT_USER_ID } from "@/lib/auth/currentUser";
import { receiptStore, ocrProvider, categorizer, correctionStore } from "@/lib/singletons";

// req-29: list the current user's digitized receipts.
// req-23 / req-27: scoped to the requesting user only.
export async function GET() {
  return NextResponse.json({ receipts: receiptStore.allForUser(CURRENT_USER_ID) });
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const receipt = await digitizeReceipt(
      {
        mimeType: file.type,
        imageBuffer: buffer,
        userId: CURRENT_USER_ID,
        imageRef: file.name,
      },
      ocrProvider,
      receiptStore,
      categorizer,
      correctionStore
    );
    return NextResponse.json(receipt, { status: 201 });
  } catch (error) {
    if (error instanceof UnsupportedFormatError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    // req-28: OCR/LLM failure surfaces a generic error, no automatic retry.
    if (error instanceof ExternalApiError) {
      return NextResponse.json({ error: error.message }, { status: 502 });
    }
    throw error;
  }
}
