import type { Brand } from "@/app/_interface/product";

export async function getAllBrands(): Promise<Brand[]> {
  const res = await fetch(`${process.env.BASE_API}/api/v1/brands?limit=50`, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch brands");
  }

  const data = await res.json();
  return data.data;
}
