"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { InquiryStatus } from "@prisma/client";

async function requireAdmin() {
  const session = await auth();
  if (!session) redirect("/admin/login");
}

function str(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}
function bool(formData: FormData, key: string): boolean {
  return formData.get(key) === "on";
}

// ----- Parts -----

export async function createPart(formData: FormData) {
  await requireAdmin();

  await prisma.part.create({
    data: {
      sku: str(formData, "sku"),
      nameVi: str(formData, "nameVi"),
      nameEn: str(formData, "nameEn"),
      craneModel: str(formData, "craneModel"),
      descriptionVi: str(formData, "descriptionVi"),
      descriptionEn: str(formData, "descriptionEn"),
      image: str(formData, "image") || "gear",
      featured: bool(formData, "featured"),
      categoryId: str(formData, "categoryId"),
    },
  });

  revalidatePath("/admin/parts");
  revalidatePath("/[locale]/parts", "page");
  redirect("/admin/parts");
}

export async function updatePart(id: string, formData: FormData) {
  await requireAdmin();

  await prisma.part.update({
    where: { id },
    data: {
      sku: str(formData, "sku"),
      nameVi: str(formData, "nameVi"),
      nameEn: str(formData, "nameEn"),
      craneModel: str(formData, "craneModel"),
      descriptionVi: str(formData, "descriptionVi"),
      descriptionEn: str(formData, "descriptionEn"),
      image: str(formData, "image") || "gear",
      featured: bool(formData, "featured"),
      categoryId: str(formData, "categoryId"),
    },
  });

  revalidatePath("/admin/parts");
  revalidatePath("/[locale]/parts", "page");
  redirect("/admin/parts");
}

export async function deletePart(id: string) {
  await requireAdmin();
  await prisma.inquiry.updateMany({ where: { partId: id }, data: { partId: null } });
  await prisma.part.delete({ where: { id } });
  revalidatePath("/admin/parts");
  revalidatePath("/[locale]/parts", "page");
}

// ----- News -----

export async function createNewsPost(formData: FormData) {
  await requireAdmin();

  await prisma.newsPost.create({
    data: {
      slug: str(formData, "slug"),
      titleVi: str(formData, "titleVi"),
      titleEn: str(formData, "titleEn"),
      excerptVi: str(formData, "excerptVi"),
      excerptEn: str(formData, "excerptEn"),
      contentVi: str(formData, "contentVi"),
      contentEn: str(formData, "contentEn"),
      coverImage: str(formData, "coverImage") || "default",
      published: bool(formData, "published"),
    },
  });

  revalidatePath("/admin/news");
  revalidatePath("/[locale]/news", "page");
  redirect("/admin/news");
}

export async function updateNewsPost(id: string, formData: FormData) {
  await requireAdmin();

  await prisma.newsPost.update({
    where: { id },
    data: {
      slug: str(formData, "slug"),
      titleVi: str(formData, "titleVi"),
      titleEn: str(formData, "titleEn"),
      excerptVi: str(formData, "excerptVi"),
      excerptEn: str(formData, "excerptEn"),
      contentVi: str(formData, "contentVi"),
      contentEn: str(formData, "contentEn"),
      coverImage: str(formData, "coverImage") || "default",
      published: bool(formData, "published"),
    },
  });

  revalidatePath("/admin/news");
  revalidatePath("/[locale]/news", "page");
  redirect("/admin/news");
}

export async function deleteNewsPost(id: string) {
  await requireAdmin();
  await prisma.newsPost.delete({ where: { id } });
  revalidatePath("/admin/news");
  revalidatePath("/[locale]/news", "page");
}

// ----- Inquiries -----

export async function updateInquiryStatus(id: string, status: InquiryStatus) {
  await requireAdmin();
  await prisma.inquiry.update({ where: { id }, data: { status } });
  revalidatePath("/admin/inquiries");
}
