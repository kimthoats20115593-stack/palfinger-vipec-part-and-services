import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Hostinger's "Web Apps" hosting gives every deploy a brand-new, non-persistent
// filesystem — saving uploads under public/ would vanish on the next redeploy.
// MySQL is the only thing confirmed to persist, so uploaded images/videos are
// stored as bytes in the database and served back through /api/uploads/[id].
const MAX_IMAGE_BYTES = 8 * 1024 * 1024; // 8MB, generous headroom over the client-side compressed size
const MAX_VIDEO_BYTES = 25 * 1024 * 1024; // 25MB -- Hostinger's reverse proxy may cap request bodies lower than this

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

  const isImage = file.type.startsWith("image/");
  const isVideo = file.type.startsWith("video/");

  if (!isImage && !isVideo) {
    return NextResponse.json({ error: "unsupported_type" }, { status: 400 });
  }

  const maxBytes = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
  if (file.size > maxBytes) {
    return NextResponse.json({ error: "file_too_large" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const saved = await prisma.uploadedImage.create({
    data: { data: buffer, mimeType: file.type },
  });

  // Videos have no file extension in this URL (served purely by DB id), so
  // callers that need to tell them apart from images -- e.g. MarkdownContent
  // deciding whether to render a <video> player -- match on this suffix.
  const url = isVideo ? `/api/uploads/${saved.id}?type=video` : `/api/uploads/${saved.id}`;

  return NextResponse.json({ url }, { status: 201 });
}
