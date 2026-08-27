import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { translateViToEn } from "@/lib/translate";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const text = body?.text;

  if (typeof text !== "string" || !text.trim()) {
    return NextResponse.json({ error: "no_text" }, { status: 400 });
  }
  if (text.length > 8000) {
    return NextResponse.json({ error: "text_too_long" }, { status: 400 });
  }

  try {
    const translated = await translateViToEn(text);
    return NextResponse.json({ translated });
  } catch {
    return NextResponse.json({ error: "translate_failed" }, { status: 502 });
  }
}
