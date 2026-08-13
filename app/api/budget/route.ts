import { NextRequest, NextResponse } from "next/server";
import { receiptStore } from "@/lib/singletons";
import { CURRENT_USER_ID } from "@/lib/auth/currentUser";
import { calculateMonthlyBudget } from "@/lib/budget/budgetService";

// req-12, req-13, req-14, req-25: GET /api/budget?year=2026&month=7
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const now = new Date();
  const year = Number(searchParams.get("year") ?? now.getUTCFullYear());
  const month = Number(searchParams.get("month") ?? now.getUTCMonth() + 1);

  const receipts = receiptStore.allForUser(CURRENT_USER_ID);
  const summary = calculateMonthlyBudget(receipts, year, month, now);
  return NextResponse.json(summary);
}
