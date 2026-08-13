import { NextRequest, NextResponse } from "next/server";
import { digitizeReceipt } from "@/lib/receipts/digitizeReceipt";
import { UnsupportedFormatError } from "@/lib/receipts/validateFormat";
import { InMemoryReceiptStore } from "@/lib/receipts/receiptStore";
import { MockOcrProvider } from "@/lib/receipts/ocrProvider";

// Process-lifetime store — a placeholder for the Postgres data layer named
// in the approved concept. See the implementation note's Risks section.
const store = new InMemoryReceiptStore();

// Fixed mock OCR fixture — placeholder until a real OCR API is wired up.
// See the implementation note's Risks section.
const ocr = new MockOcrProvider({
  merchantName: "Sample Merchant",
  transactionDate: new Date().toISOString().slice(0, 10),
  transactionTime: "12:00",
  lineItems: [
    { name: "Sample Item", quantity: 1, unitPrice: 1, totalPrice: 1 },
  ],
  totalAmount: 1,
});

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
        userId: "dev-user",
        imageRef: file.name,
      },
      ocr,
      store
    );
    return NextResponse.json(receipt, { status: 201 });
  } catch (error) {
    if (error instanceof UnsupportedFormatError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    throw error;
  }
}
