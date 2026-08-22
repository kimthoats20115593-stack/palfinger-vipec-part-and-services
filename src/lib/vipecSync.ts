import { prisma } from "./prisma";
import type { LubricantType } from "@prisma/client";

const STORE_API = "https://vipec-vp.vn/wp-json/wc/store/v1/products";

// Verified real WooCommerce category IDs on vipec-vp.vn
const CRANE_CATEGORY_ID = 667; // "Cẩu gập"
const LUBRICANT_CATEGORY_ID = 729; // "Dầu, nhớt, mỡ"

type WooImage = { src: string };
type WooProduct = {
  id: number;
  name: string;
  slug: string;
  sku: string;
  permalink: string;
  images: WooImage[];
};

async function fetchCategory(categoryId: number): Promise<WooProduct[]> {
  const res = await fetch(`${STORE_API}?category=${categoryId}&per_page=100`, {
    headers: { Accept: "application/json" },
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) {
    throw new Error(`vipec-vp.vn trả về lỗi ${res.status} cho category ${categoryId}`);
  }
  return res.json();
}

function extractTonnage(name: string): string | null {
  const match = name.match(/(\d+(?:[.,]\d+)?)\s*t[ấa]n/i);
  return match ? `${match[1].replace(",", ".")} tấn` : null;
}

const LUBRICANT_TYPE_RULES: Array<{ pattern: RegExp; type: LubricantType }> = [
  { pattern: /mỡ/i, type: "GREASE" },
  { pattern: /thủy lực/i, type: "HYDRAULIC_OIL" },
  { pattern: /cầu|hộp số/i, type: "GEAR_OIL" },
  { pattern: /động cơ|diesel/i, type: "ENGINE_OIL" },
];

function inferLubricantType(name: string): LubricantType {
  for (const rule of LUBRICANT_TYPE_RULES) {
    if (rule.pattern.test(name)) return rule.type;
  }
  return "OTHER";
}

const KNOWN_BRANDS = ["Idemitsu", "Sinopec", "Valvoline Cummins", "Valvoline"];

function inferBrand(name: string): string | null {
  for (const brand of KNOWN_BRANDS) {
    if (name.toLowerCase().includes(brand.toLowerCase())) return brand;
  }
  return null;
}

export type SyncSummary = {
  craneModels: { created: number; skipped: number };
  lubricants: { created: number; skipped: number };
  errors: string[];
};

export async function syncFromVipec(): Promise<SyncSummary> {
  const summary: SyncSummary = {
    craneModels: { created: 0, skipped: 0 },
    lubricants: { created: 0, skipped: 0 },
    errors: [],
  };

  try {
    const craneProducts = await fetchCategory(CRANE_CATEGORY_ID);
    for (const [index, product] of craneProducts.entries()) {
      const existing = await prisma.craneModel.findUnique({
        where: { externalId: product.id },
      });
      if (existing) {
        summary.craneModels.skipped += 1;
        continue;
      }
      await prisma.craneModel.create({
        data: {
          externalId: product.id,
          slug: product.slug,
          nameVi: product.name,
          nameEn: product.name,
          tonnage: extractTonnage(product.name),
          image: product.images?.[0]?.src ?? null,
          sourceUrl: product.permalink,
          order: index,
        },
      });
      summary.craneModels.created += 1;
    }
  } catch (error) {
    summary.errors.push(
      `Đồng bộ model cẩu thất bại: ${error instanceof Error ? error.message : String(error)}`
    );
  }

  try {
    const lubricantProducts = await fetchCategory(LUBRICANT_CATEGORY_ID);
    for (const product of lubricantProducts) {
      const existing = await prisma.lubricant.findUnique({
        where: { externalId: product.id },
      });
      if (existing) {
        summary.lubricants.skipped += 1;
        continue;
      }
      await prisma.lubricant.create({
        data: {
          externalId: product.id,
          slug: product.slug,
          nameVi: product.name,
          nameEn: product.name,
          brand: inferBrand(product.name),
          type: inferLubricantType(product.name),
          image: product.images?.[0]?.src ?? null,
          sourceUrl: product.permalink,
          descriptionVi: "",
          descriptionEn: "",
        },
      });
      summary.lubricants.created += 1;
    }
  } catch (error) {
    summary.errors.push(
      `Đồng bộ dầu nhớt mỡ thất bại: ${error instanceof Error ? error.message : String(error)}`
    );
  }

  return summary;
}
