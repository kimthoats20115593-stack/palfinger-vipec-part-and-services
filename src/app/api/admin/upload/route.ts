import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Hostinger's "Web Apps" hosting gives every deploy a brand-new, non-persistent
// filesystem — saving uploads under public/ would vanish on the next redeploy.
// MySQL is the only thing confirmed to persist, so uploaded images are stored
// as bytes in the database and served back through /api/uploads/[id].
const MAX_BYTES = 8 * 1024 * 1024; // 8MB, generous headroom over the client-side compressed size

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");

  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "no_file" }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "not_an_image" }, { status: 400 });
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "file_too_large" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const saved = await prisma.uploadedImage.create({
    data: { data: buffer, mimeType: file.type },
  });

  return NextResponse.json({ url: `/api/uploads/${saved.id}` }, { status: 201 });
}
