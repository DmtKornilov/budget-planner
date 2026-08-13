import { NextRequest, NextResponse } from "next/server";
import { positionOverrideStore } from "@/lib/singletons";
import type { PositionMatchResult } from "@/lib/positionMatching/positionMatching";

const VALID_RESULTS: PositionMatchResult[] = ["same_position", "different_position"];

// req-17: POST { pairId: string, result: "same_position" | "different_position" }
export async function POST(req: NextRequest) {
  const body = (await req.json()) as { pairId?: string; result?: PositionMatchResult };
  if (!body.pairId || !body.result) {
    return NextResponse.json({ error: "pairId and result are required." }, { status: 400 });
  }
  if (!VALID_RESULTS.includes(body.result)) {
    return NextResponse.json(
      { error: 'result must be "same_position" or "different_position".' },
      { status: 400 }
    );
  }
  positionOverrideStore.setOverride(body.pairId, body.result);
  return NextResponse.json({ pairId: body.pairId, result: body.result });
}
