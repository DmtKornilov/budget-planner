import { NextRequest, NextResponse } from "next/server";
import { goalStore } from "@/lib/singletons";
import { CURRENT_USER_ID } from "@/lib/auth/currentUser";
import type { GoalType } from "@/lib/goals/goalStore";

// req-20: list goals for the current user.
export async function GET() {
  return NextResponse.json({ goals: goalStore.listForUser(CURRENT_USER_ID) });
}

// req-20: define a financial or lifestyle goal. Multiple goals may coexist.
export async function POST(req: NextRequest) {
  const body = (await req.json()) as { type?: GoalType; description?: string };
  if (body.type !== "financial" && body.type !== "lifestyle") {
    return NextResponse.json({ error: 'type must be "financial" or "lifestyle".' }, { status: 400 });
  }
  if (!body.description) {
    return NextResponse.json({ error: "description is required." }, { status: 400 });
  }

  const goal = goalStore.save({ userId: CURRENT_USER_ID, type: body.type, description: body.description });
  return NextResponse.json(goal, { status: 201 });
}
