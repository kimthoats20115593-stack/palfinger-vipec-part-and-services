"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { InquiryStatus, LubricantType } from "@prisma/client";

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
function nullableStr(formData: FormData, key: string): string | null {
  const value = str(formData, key);
  return value || null;
}
function nullableInt(formData: FormData, key: string): number | null {
  const value = str(formData, key);
  if (!value) return null;
  const n = Number(value);
  return Number.isFinite(n) ? Math.round(n) : null;
}

function specsFromForm(formData: FormData): { label: string; value: string }[] | undefined {
  const labels = formData.getAll("specLabel").map(String);
  const values = formData.getAll("specValue").map(String);
  const specs = labels
    .map((label, i) => ({ label: label.trim(), value: (values[i] ?? "").trim() }))
    .filter((s) => s.label && s.value);
  return specs.length ? specs : undefined;
}

function imagesFromForm(formData: FormData): string[] {
  return formData
    .getAll("imageUrl")
    .map((v) => String(v).trim())
    .filter(Boolean);
}

// ----- Parts -----

export async function createPart(formData: FormData) {
  await requireAdmin();

  const images = imagesFromForm(formData);

  const part = await prisma.part.create({
    data: {
      sku: str(formData, "sku"),
      nameVi: str(formData, "nameVi"),
      nameEn: str(formData, "nameEn"),
      craneModelId: nullableStr(formData, "craneModelId"),
      descriptionVi: str(formData, "descriptionVi"),
      descriptionEn: str(formData, "descriptionEn"),
      detailVi: nullableStr(formData, "detailVi"),
      detailEn: nullableStr(formData, "detailEn"),
      image: str(formData, "image") || "gear",
      photoUrl: images[0] ?? null,
      featured: bool(formData, "featured"),
      categoryId: str(formData, "categoryId"),
      specs: specsFromForm(formData),
      price: nullableInt(formData, "price"),
      status: nullableStr(formData, "status"),
      unit: nullableStr(formData, "unit"),
      stockQty: nullableInt(formData, "stockQty"),
    },
  });

  if (images.length) {
    await prisma.partImage.createMany({
      data: images.map((url, order) => ({ partId: part.id, url, order })),
    });
  }

  revalidatePath("/admin/parts");
  revalidatePath("/[locale]/parts", "page");
  redirect("/admin/parts");
}

export async function updatePart(id: string, formData: FormData) {
  await requireAdmin();

  const images = imagesFromForm(formData);

  await prisma.part.update({
    where: { id },
    data: {
      sku: str(formData, "sku"),
      nameVi: str(formData, "nameVi"),
      nameEn: str(formData, "nameEn"),
      craneModelId: nullableStr(formData, "craneModelId"),
      descriptionVi: str(formData, "descriptionVi"),
      descriptionEn: str(formData, "descriptionEn"),
      detailVi: nullableStr(formData, "detailVi"),
      detailEn: nullableStr(formData, "detailEn"),
      image: str(formData, "image") || "gear",
      photoUrl: images[0] ?? null,
      featured: bool(formData, "featured"),
      categoryId: str(formData, "categoryId"),
      specs: specsFromForm(formData) ?? [],
      price: nullableInt(formData, "price"),
      status: nullableStr(formData, "status"),
      unit: nullableStr(formData, "unit"),
      stockQty: nullableInt(formData, "stockQty"),
    },
  });

  await prisma.partImage.deleteMany({ where: { partId: id } });
  if (images.length) {
    await prisma.partImage.createMany({
      data: images.map((url, order) => ({ partId: id, url, order })),
    });
  }

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

// ----- Crane Models -----

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function createCraneModel(formData: FormData) {
  await requireAdmin();

  const nameVi = str(formData, "nameVi");
  await prisma.craneModel.create({
    data: {
      slug: nullableStr(formData, "slug") || slugify(nameVi),
      nameVi,
      nameEn: str(formData, "nameEn") || nameVi,
      tonnage: nullableStr(formData, "tonnage"),
      image: nullableStr(formData, "image"),
    },
  });

  revalidatePath("/admin/crane-models");
  revalidatePath("/[locale]/parts", "page");
  redirect("/admin/crane-models");
}

export async function updateCraneModel(id: string, formData: FormData) {
  await requireAdmin();

  const nameVi = str(formData, "nameVi");
  await prisma.craneModel.update({
    where: { id },
    data: {
      slug: nullableStr(formData, "slug") || slugify(nameVi),
      nameVi,
      nameEn: str(formData, "nameEn") || nameVi,
      tonnage: nullableStr(formData, "tonnage"),
      image: nullableStr(formData, "image"),
    },
  });

  revalidatePath("/admin/crane-models");
  revalidatePath("/[locale]/parts", "page");
  redirect("/admin/crane-models");
}

export async function deleteCraneModel(id: string) {
  await requireAdmin();
  await prisma.part.updateMany({ where: { craneModelId: id }, data: { craneModelId: null } });
  await prisma.craneModel.delete({ where: { id } });
  revalidatePath("/admin/crane-models");
  revalidatePath("/[locale]/parts", "page");
}

// ----- Lubricants -----

export async function createLubricant(formData: FormData) {
  await requireAdmin();

  const nameVi = str(formData, "nameVi");
  await prisma.lubricant.create({
    data: {
      slug: nullableStr(formData, "slug") || slugify(nameVi),
      nameVi,
      nameEn: str(formData, "nameEn") || nameVi,
      brand: nullableStr(formData, "brand"),
      type: (str(formData, "type") || "OTHER") as LubricantType,
      packaging: nullableStr(formData, "packaging"),
      image: nullableStr(formData, "image"),
      featured: bool(formData, "featured"),
      descriptionVi: str(formData, "descriptionVi"),
      descriptionEn: str(formData, "descriptionEn"),
    },
  });

  revalidatePath("/admin/lubricants");
  revalidatePath("/[locale]/parts", "page");
  redirect("/admin/lubricants");
}

export async function updateLubricant(id: string, formData: FormData) {
  await requireAdmin();

  const nameVi = str(formData, "nameVi");
  await prisma.lubricant.update({
    where: { id },
    data: {
      slug: nullableStr(formData, "slug") || slugify(nameVi),
      nameVi,
      nameEn: str(formData, "nameEn") || nameVi,
      brand: nullableStr(formData, "brand"),
      type: (str(formData, "type") || "OTHER") as LubricantType,
      packaging: nullableStr(formData, "packaging"),
      image: nullableStr(formData, "image"),
      featured: bool(formData, "featured"),
      descriptionVi: str(formData, "descriptionVi"),
      descriptionEn: str(formData, "descriptionEn"),
    },
  });

  revalidatePath("/admin/lubricants");
  revalidatePath("/[locale]/parts", "page");
  redirect("/admin/lubricants");
}

export async function deleteLubricant(id: string) {
  await requireAdmin();
  await prisma.inquiry.updateMany({ where: { lubricantId: id }, data: { lubricantId: null } });
  await prisma.lubricant.delete({ where: { id } });
  revalidatePath("/admin/lubricants");
  revalidatePath("/[locale]/parts", "page");
}

// ----- VIPEC sync -----

export async function triggerVipecSync() {
  await requireAdmin();
  const { syncFromVipec } = await import("@/lib/vipecSync");
  const summary = await syncFromVipec();
  revalidatePath("/admin");
  revalidatePath("/admin/crane-models");
  revalidatePath("/admin/lubricants");
  revalidatePath("/[locale]/parts", "page");
  return summary;
}
