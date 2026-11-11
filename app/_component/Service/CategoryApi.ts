import { Category } from "@/app/_interface/product"
import { API_BASE_URL } from "./apiConfig";

export async function getAllCategories(): Promise<Category[]> {
  const res = await fetch(`${API_BASE_URL}/api/v1/categories`, {
    method: "GET"
  })
  if (!res.ok) {
    throw new Error("Failed to fetch categories")
  }
  const data = await res.json()
  return data.data
}


export async function getCategoryById(id: string): Promise<Category | null> {
  const res = await fetch(`${API_BASE_URL}/api/v1/categories/${encodeURIComponent(id)}`, {
    next: { revalidate: 3600 },
  })
  if (!res.ok) return null
  const data = await res.json()
  return data.data ?? null
}
