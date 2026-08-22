import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const idsParam = request.nextUrl.searchParams.get("ids") ?? "";
  const ids = idsParam
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean)
    .slice(0, 4);

  if (ids.length === 0) {
    return NextResponse.json({ parts: [] });
  }

  const parts = await prisma.part.findMany({
    where: { id: { in: ids } },
    include: { category: true, craneModel: true },
  });

  return NextResponse.json({ parts });
}
