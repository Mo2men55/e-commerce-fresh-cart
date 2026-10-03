import { prodType } from "@/app/_interface/product";

const PRODUCTS_URL = `${process.env.BASE_API}/api/v1/products`;

export type ProductFilters = {
  keyword?: string;
  category?: string | string[];
  brand?: string | string[];
  minPrice?: string | number;
  maxPrice?: string | number;
  sort?: string;
  page?: string | number;
  limit?: string | number;
};

export type ProductsListResponse = {
  results: number;
  metadata: {
    currentPage: number;
    numberOfPages: number;
    limit: number;
    nextPage?: number;
    prevPage?: number;
  };
  data: prodType[];
};

type ProductResponse = {
  data: prodType;
};

function appendListParam(
  params: URLSearchParams,
  key: string,
  value?: string | string[],
) {
  if (!value) return;
  const values = Array.isArray(value)
    ? value
    : value.split(",").map((v) => v.trim()).filter(Boolean);

  for (const item of values) {
    params.append(key, item);
  }
}

export function buildProductsQuery(filters: ProductFilters = {}) {
  const params = new URLSearchParams();

  if (filters.keyword?.trim()) {
    params.set("keyword", filters.keyword.trim());
  }

  appendListParam(params, "category[in]", filters.category);
  appendListParam(params, "brand", filters.brand);

  if (filters.minPrice !== undefined && filters.minPrice !== "") {
    params.set("price[gte]", String(filters.minPrice));
  }
  if (filters.maxPrice !== undefined && filters.maxPrice !== "") {
    params.set("price[lte]", String(filters.maxPrice));
  }
  if (filters.sort) {
    params.set("sort", filters.sort);
  }

  params.set("page", String(filters.page ?? 1));
  params.set("limit", String(filters.limit ?? 12));

  return params;
}

export async function getProducts(
  filters: ProductFilters = {},
): Promise<ProductsListResponse> {
  const params = buildProductsQuery(filters);
  const response = await fetch(`${PRODUCTS_URL}?${params.toString()}`, {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json();
}

export async function getAllProducts(): Promise<prodType[]> {
  const result = await getProducts({ limit: 40 });
  return result.data;
}

export async function getProductDetails(prodId: string): Promise<prodType> {
  const response = await fetch(
    `https://ecommerce.routemisr.com/api/v1/products/${prodId}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch product details");
  }

  const product: ProductResponse = await response.json();
  return product.data;
}
