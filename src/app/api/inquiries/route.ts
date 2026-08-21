import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendInquiryNotification } from "@/lib/mailer";

const inquirySchema = z.object({
  type: z.enum(["QUOTE", "CONTACT"]),
  name: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(6).max(30),
  email: z.string().trim().email().max(160),
  company: z.string().trim().max(160).optional().or(z.literal("")),
  partId: z.string().trim().max(60).optional().or(z.literal("")),
  message: z.string().trim().min(5).max(2000),
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = inquirySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const { type, name, phone, email, company, partId, message } = parsed.data;

  let part = null;
  if (partId) {
    part = await prisma.part.findUnique({ where: { id: partId } });
  }

  const inquiry = await prisma.inquiry.create({
    data: {
      type,
      name,
      phone,
      email,
      company: company || null,
      message,
      partId: part?.id ?? null,
    },
  });

  try {
    await sendInquiryNotification({
      type,
      name,
      phone,
      email,
      company,
      message,
      partLabel: part ? `${part.nameVi} (${part.sku})` : null,
    });
  } catch {
    // Email delivery is best-effort; the inquiry is already saved in the database.
  }

  return NextResponse.json({ id: inquiry.id }, { status: 201 });
}
