import { Suspense } from "react";
import { getAllBrands } from "../_component/Service/BrandApi";
import { getAllCategories } from "../_component/Service/CategoryApi";
import { getProducts } from "../_component/Service/ProductApi";
import ShopComp from "../_component/ShopComp/ShopComp";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0];
  return value;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;

  const keyword = first(params.keyword) ?? "";
  const category = first(params.category);
  const brand = first(params.brand);
  const minPrice = first(params.minPrice);
  const maxPrice = first(params.maxPrice);
  const sort = first(params.sort);
  const page = first(params.page) ?? "1";

  const [productsResponse, categories, brands] = await Promise.all([
    getProducts({
      keyword,
      category,
      brand,
      minPrice,
      maxPrice,
      sort,
      page,
      limit: 12,
    }),
    getAllCategories(),
    getAllBrands(),
  ]);

  return (
    <Suspense
      fallback={
        <main className="bg-[#F8F9FA] px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl animate-pulse space-y-6">
            <div className="h-8 w-48 rounded bg-slate-200" />
            <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
              <div className="hidden h-96 rounded-2xl bg-white lg:block" />
              <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="h-80 rounded-lg bg-white" />
                ))}
              </div>
            </div>
          </div>
        </main>
      }
    >
      <ShopComp
        products={productsResponse.data}
        categories={categories}
        brands={brands}
        results={productsResponse.results ?? productsResponse.data.length}
        currentPage={productsResponse.metadata?.currentPage ?? Number(page)}
        numberOfPages={productsResponse.metadata?.numberOfPages ?? 1}
      />
    </Suspense>
  );
}
