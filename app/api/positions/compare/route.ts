import { NextRequest, NextResponse } from "next/server";
import { compareReceiptPhotos } from "@/lib/positionMatching/positionMatching";
import type { ParsedPhoto } from "@/lib/positionMatching/positionMatching";

// req-15, req-16: POST { photoA: ParsedPhoto, photoB: ParsedPhoto }
export async function POST(req: NextRequest) {
  const body = (await req.json()) as { photoA?: ParsedPhoto; photoB?: ParsedPhoto };
  if (!body.photoA || !body.photoB) {
    return NextResponse.json({ error: "photoA and photoB are required." }, { status: 400 });
  }

  const result = compareReceiptPhotos(body.photoA, body.photoB);
  return NextResponse.json(result);
}
