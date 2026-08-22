import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { syncFromVipec } from "@/lib/vipecSync";

async function isAuthorized(request: NextRequest): Promise<boolean> {
  const session = await auth();
  if (session) return true;

  const token = request.headers.get("x-sync-token");
  const expected = process.env.SYNC_SECRET;
  return Boolean(expected) && token === expected;
}

export async function POST(request: NextRequest) {
  if (!(await isAuthorized(request))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const summary = await syncFromVipec();
  return NextResponse.json(summary);
}
