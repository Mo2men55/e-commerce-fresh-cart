import type { Brand } from "@/app/_interface/product";
import { API_BASE_URL } from "./apiConfig";

export async function getAllBrands(): Promise<Brand[]> {
  const res = await fetch(`${API_BASE_URL}/api/v1/brands?limit=50`, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch brands");
  }

  const data = await res.json();
  return data.data;
}
