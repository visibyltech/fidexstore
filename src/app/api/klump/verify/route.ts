import { NextRequest, NextResponse } from "next/server";
import { verifyKlumpTransaction } from "@/lib/klump";

export async function GET(request: NextRequest) {
  const reference = request.nextUrl.searchParams.get("reference");

  if (!reference) {
    return NextResponse.json({ error: "Missing transaction reference" }, { status: 400 });
  }

  const result = await verifyKlumpTransaction(reference);
  if (!result.ok) {
    return NextResponse.json(result.raw ?? { error: result.error }, { status: result.status });
  }
  return NextResponse.json(result.raw);
}
