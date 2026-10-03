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