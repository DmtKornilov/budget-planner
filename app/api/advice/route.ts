import { NextResponse } from "next/server";
import { receiptStore } from "@/lib/singletons";
import { CURRENT_USER_ID } from "@/lib/auth/currentUser";
import { getOptimizationAdvice } from "@/lib/goals/adviceService";

// req-21, req-26: GET /api/advice
export async function GET() {
  const receiptCount = receiptStore.allForUser(CURRENT_USER_ID).length;
  const advice = getOptimizationAdvice(receiptCount);
  return NextResponse.json(advice);
}
