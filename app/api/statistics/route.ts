import { NextRequest, NextResponse } from "next/server";
import { receiptStore } from "@/lib/singletons";
import { CURRENT_USER_ID } from "@/lib/auth/currentUser";
import { getCategoryStatistics } from "@/lib/statistics/statisticsService";

// req-18, req-19, req-23: GET /api/statistics?start=2026-07-01&end=2026-07-31
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const start = searchParams.get("start");
  const end = searchParams.get("end");
  if (!start || !end) {
    return NextResponse.json({ error: "start and end query params are required." }, { status: 400 });
  }

  const receipts = receiptStore.allForUser(CURRENT_USER_ID);
  const result = getCategoryStatistics(receipts, start, end);
  return NextResponse.json(result);
}
