import type { Subcategory } from "@/app/_interface/product";
import { API_BASE_URL } from "./apiConfig";

const SUBCATEGORIES_URL = `${API_BASE_URL}/api/v1/subcategories`;

export async function getAllSubcategories(): Promise<Subcategory[]> {
  const res = await fetch(`${SUBCATEGORIES_URL}?limit=100`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error("Failed to fetch subcategories");
  return (await res.json()).data;
}

export async function getSubcategoryById(id: string): Promise<Subcategory | null> {
  const res = await fetch(`${SUBCATEGORIES_URL}/${encodeURIComponent(id)}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return null;
  return (await res.json()).data ?? null;
}

/**
 * Subcategories that belong to one category.
 * The nested `/categories/:id/subcategories` endpoint ignores the id and returns
 * every subcategory, so we filter with `?category=` instead.
 */
export async function getSubcategoriesOfCategory(
  categoryId: string,
): Promise<Subcategory[]> {
  const res = await fetch(
    `${SUBCATEGORIES_URL}?category=${encodeURIComponent(categoryId)}&limit=100`,
    { next: { revalidate: 3600 } },
  );
  if (!res.ok) throw new Error("Failed to fetch subcategories");
  return (await res.json()).data;
}
