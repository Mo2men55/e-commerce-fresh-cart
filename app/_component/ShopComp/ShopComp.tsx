"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import {
  FunnelIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import type { Brand, Category } from "@/app/_interface/product";
import type { prodType } from "@/app/_interface/product";
import ProductCard from "../ProductCard/ProductCard";
import TrustFeatures from "../TrustFeatures/TrustFeatures";

const SORT_OPTIONS = [
  { label: "Relevance", value: "" },
  { label: "Price: Low to High", value: "price" },
  { label: "Price: High to Low", value: "-price" },
  { label: "Top Rated", value: "-ratingsAverage" },
  { label: "Newest", value: "-createdAt" },
];

const PRICE_PRESETS = [
  { label: "Under 100", max: "100" },
  { label: "Under 500", max: "500" },
  { label: "Under 1000", max: "1000" },
  { label: "Under 5000", max: "5000" },
];

function toArray(value: string | null): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

function toggleValue(list: string[], id: string) {
  return list.includes(id) ? list.filter((item) => item !== id) : [...list, id];
}

type ShopCompProps = {
  products: prodType[];
  categories: Category[];
  brands: Brand[];
  results: number;
  currentPage: number;
  numberOfPages: number;
};

export default function ShopComp({
  products,
  categories,
  brands,
  results,
  currentPage,
  numberOfPages,
}: ShopCompProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const selectedCategories = toArray(searchParams.get("category"));
  const selectedBrands = toArray(searchParams.get("brand"));
  const keyword = searchParams.get("keyword") ?? "";
  const minPrice = searchParams.get("minPrice") ?? "";
  const maxPrice = searchParams.get("maxPrice") ?? "";
  const sort = searchParams.get("sort") ?? "";

  const [localMin, setLocalMin] = useState(minPrice);
  const [localMax, setLocalMax] = useState(maxPrice);

  useEffect(() => {
    setLocalMin(minPrice);
    setLocalMax(maxPrice);
  }, [minPrice, maxPrice]);

  const updateParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }

    if (!("page" in updates)) {
      params.delete("page");
    }

    const query = params.toString();
    startTransition(() => {
      router.push(query ? `${pathname}?${query}` : pathname);
    });
  };

  const clearFilters = () => {
    startTransition(() => {
      const params = new URLSearchParams();
      if (keyword) params.set("keyword", keyword);
      const query = params.toString();
      router.push(query ? `${pathname}?${query}` : pathname);
    });
    setLocalMin("");
    setLocalMax("");
    setFiltersOpen(false);
  };

  const activeChips = useMemo(() => {
    const chips: { key: string; label: string; clear: () => void }[] = [];

    if (keyword) {
      chips.push({
        key: "keyword",
        label: `Search: "${keyword}"`,
        clear: () => updateParams({ keyword: null }),
      });
    }

    for (const id of selectedCategories) {
      const category = categories.find((c) => c._id === id);
      chips.push({
        key: `cat-${id}`,
        label: category?.name ?? id,
        clear: () =>
          updateParams({
            category: toggleValue(selectedCategories, id).join(",") || null,
          }),
      });
    }

    for (const id of selectedBrands) {
      const brand = brands.find((b) => b._id === id);
      chips.push({
        key: `brand-${id}`,
        label: brand?.name ?? id,
        clear: () =>
          updateParams({
            brand: toggleValue(selectedBrands, id).join(",") || null,
          }),
      });
    }

    if (minPrice || maxPrice) {
      chips.push({
        key: "price",
        label: `Price: ${minPrice || "0"} – ${maxPrice || "∞"}`,
        clear: () => {
          setLocalMin("");
          setLocalMax("");
          updateParams({ minPrice: null, maxPrice: null });
        },
      });
    }

    return chips;
  }, [
    keyword,
    selectedCategories,
    selectedBrands,
    minPrice,
    maxPrice,
    categories,
    brands,
  ]);

  const FiltersPanel = (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Filters</h2>
        <button
          type="button"
          onClick={clearFilters}
          className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
        >
          Clear all
        </button>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Categories
        </h3>
        <ul className="max-h-56 space-y-2 overflow-y-auto pr-1">
          {categories.map((category) => {
            const checked = selectedCategories.includes(category._id);
            return (
              <li key={category._id}>
                <label className="flex cursor-pointer items-center gap-3 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() =>
                      updateParams({
                        category:
                          toggleValue(selectedCategories, category._id).join(
                            ",",
                          ) || null,
                      })
                    }
                    className="size-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className={checked ? "font-medium text-emerald-700" : ""}>
                    {category.name}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Price Range
        </h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            placeholder="Min"
            value={localMin}
            onChange={(e) => setLocalMin(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500"
          />
          <span className="text-slate-400">–</span>
          <input
            type="number"
            min={0}
            placeholder="Max"
            value={localMax}
            onChange={(e) => setLocalMax(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500"
          />
        </div>
        <button
          type="button"
          onClick={() =>
            updateParams({
              minPrice: localMin || null,
              maxPrice: localMax || null,
            })
          }
          className="mt-3 w-full rounded-lg bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          Apply Price
        </button>
        <div className="mt-3 flex flex-wrap gap-2">
          {PRICE_PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => {
                setLocalMin("");
                setLocalMax(preset.max);
                updateParams({ minPrice: null, maxPrice: preset.max });
              }}
              className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600 hover:border-emerald-300 hover:text-emerald-700"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Brands
        </h3>
        <ul className="max-h-56 space-y-2 overflow-y-auto pr-1">
          {brands.map((brand) => {
            const checked = selectedBrands.includes(brand._id);
            return (
              <li key={brand._id}>
                <label className="flex cursor-pointer items-center gap-3 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() =>
                      updateParams({
                        brand:
                          toggleValue(selectedBrands, brand._id).join(",") ||
                          null,
                      })
                    }
                    className="size-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className={checked ? "font-medium text-emerald-700" : ""}>
                    {brand.name}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );

  const pages = (() => {
    if (numberOfPages <= 7) {
      return Array.from({ length: numberOfPages }, (_, i) => i + 1);
    }
    const start = Math.max(1, Math.min(currentPage - 2, numberOfPages - 4));
    return Array.from({ length: 5 }, (_, i) => start + i);
  })();

  return (
    <>
      <main className="min-h-screen bg-[#F8F9FA] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <nav className="mb-6 text-sm text-slate-500" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2">
              <li>
                <Link href="/" className="hover:text-emerald-600">
                  Home
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="font-medium text-slate-800">
                {keyword ? "Search Results" : "Shop"}
              </li>
            </ol>
          </nav>

          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                {keyword ? `Results for "${keyword}"` : "All Products"}
              </h1>
              <p className="mt-1 text-slate-500">
                {results} {results === 1 ? "product" : "products"} found
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setFiltersOpen(true)}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 lg:hidden"
              >
                <FunnelIcon className="size-4" />
                Filters
              </button>
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <span className="hidden sm:inline">Sort by:</span>
                <select
                  value={sort}
                  onChange={(e) =>
                    updateParams({ sort: e.target.value || null })
                  }
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.label} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {activeChips.length > 0 && (
            <div className="mb-6 flex flex-wrap items-center gap-2">
              {activeChips.map((chip) => (
                <button
                  key={chip.key}
                  type="button"
                  onClick={chip.clear}
                  className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100"
                >
                  {chip.label}
                  <XMarkIcon className="size-3.5" />
                </button>
              ))}
            </div>
          )}

          <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
            <aside className="hidden h-fit rounded-2xl border border-slate-100 bg-white p-5 shadow-sm lg:sticky lg:top-24 lg:block">
              {FiltersPanel}
            </aside>

            <section className={isPending ? "opacity-60 transition" : ""}>
              {products.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
                  <MagnifyingGlassIcon className="mx-auto size-12 text-slate-300" />
                  <h2 className="mt-4 text-xl font-semibold text-slate-800">
                    No products found
                  </h2>
                  <p className="mt-2 text-slate-500">
                    Try a different keyword or clear some filters.
                  </p>
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-6 inline-flex rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                    {products.map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                  </div>

                  {numberOfPages > 1 && (
                    <nav
                      className="mt-10 flex items-center justify-center gap-2"
                      aria-label="Pagination"
                    >
                      <button
                        type="button"
                        disabled={currentPage <= 1}
                        onClick={() =>
                          updateParams({ page: String(currentPage - 1) })
                        }
                        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm disabled:opacity-40"
                      >
                        Prev
                      </button>
                      {pages.map((page) => (
                        <button
                          key={page}
                          type="button"
                          onClick={() => updateParams({ page: String(page) })}
                          className={`size-10 rounded-lg text-sm font-medium ${
                            page === currentPage
                              ? "bg-emerald-600 text-white"
                              : "border border-slate-200 bg-white text-slate-700 hover:border-emerald-300"
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        type="button"
                        disabled={currentPage >= numberOfPages}
                        onClick={() =>
                          updateParams({ page: String(currentPage + 1) })
                        }
                        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm disabled:opacity-40"
                      >
                        Next
                      </button>
                    </nav>
                  )}
                </>
              )}
            </section>
          </div>
        </div>
      </main>

      <TrustFeatures />

      <Dialog
        open={filtersOpen}
        onClose={setFiltersOpen}
        className="relative z-50 lg:hidden"
      >
        <DialogBackdrop className="fixed inset-0 bg-black/30" />
        <DialogPanel className="fixed inset-y-0 right-0 w-full max-w-sm overflow-y-auto bg-white p-6 shadow-xl">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Filters</h2>
            <button
              type="button"
              onClick={() => setFiltersOpen(false)}
              aria-label="Close filters"
            >
              <XMarkIcon className="size-6 text-slate-500" />
            </button>
          </div>
          {FiltersPanel}
        </DialogPanel>
      </Dialog>
    </>
  );
}
