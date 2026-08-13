import { NextRequest, NextResponse } from "next/server";
import { receiptStore, correctionStore } from "@/lib/singletons";
import { CURRENT_USER_ID } from "@/lib/auth/currentUser";
import { reassignCategoryAndLearn } from "@/lib/categorization/categorizeReceipt";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// req-27: direct access to another user's receipt is denied.
export async function GET(_req: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const receipt = receiptStore.getForUser(id, CURRENT_USER_ID);
  if (!receipt) {
    return NextResponse.json({ error: "Receipt not found." }, { status: 404 });
  }
  return NextResponse.json(receipt);
}

// req-10: manually reassign a line item's category.
// req-11: the reassignment is also learned for future receipts from the same merchant.
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const owned = receiptStore.getForUser(id, CURRENT_USER_ID);
  if (!owned) {
    return NextResponse.json({ error: "Receipt not found." }, { status: 404 });
  }

  const body = (await req.json()) as { lineItemIndex?: number; category?: string };
  if (typeof body.lineItemIndex !== "number" || typeof body.category !== "string" || !body.category) {
    return NextResponse.json({ error: "lineItemIndex and category are required." }, { status: 400 });
  }

  const updated = reassignCategoryAndLearn(receiptStore, correctionStore, id, body.lineItemIndex, body.category);
  if (!updated) {
    return NextResponse.json({ error: "Line item not found." }, { status: 400 });
  }
  return NextResponse.json(updated);
}

// req-24: deleting a receipt removes it from all budget/statistics calculations immediately.
export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const owned = receiptStore.getForUser(id, CURRENT_USER_ID);
  if (!owned) {
    return NextResponse.json({ error: "Receipt not found." }, { status: 404 });
  }
  receiptStore.delete(id);
  return NextResponse.json({ deleted: true });
}
