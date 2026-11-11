import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon, CubeIcon } from "@heroicons/react/24/outline";
import ProductCard from "../ProductCard/ProductCard";
import type { prodType } from "@/app/_interface/product";

/** Product grid + pagination shared by the category and brand detail pages. */
export default function CollectionProducts({
  products,
  currentPage,
  numberOfPages,
  hrefForPage,
  emptyText,
}: {
  products: prodType[];
  currentPage: number;
  numberOfPages: number;
  hrefForPage: (page: number) => string;
  emptyText: string;
}) {
  if (products.length === 0) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white px-6 py-16 text-center">
        <CubeIcon className="mx-auto size-12 text-slate-300" />
        <p className="mt-3 font-medium text-slate-700">No products found</p>
        <p className="text-sm text-slate-500">{emptyText}</p>
      </div>
    );
  }

  const pages = Array.from({ length: numberOfPages }, (_, i) => i + 1);
  const linkBase =
    "flex size-10 items-center justify-center rounded-lg border text-sm font-medium transition";

  return (
    <>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {numberOfPages > 1 && (
        <nav className="mt-10 flex flex-wrap items-center justify-center gap-2" aria-label="Pagination">
          {currentPage > 1 && (
            <Link href={hrefForPage(currentPage - 1)} aria-label="Previous page" className={`${linkBase} border-slate-200 bg-white text-slate-600 hover:border-emerald-600`}>
              <ChevronLeftIcon className="size-4" />
            </Link>
          )}
          {pages.map((page) => (
            <Link
              key={page}
              href={hrefForPage(page)}
              aria-current={page === currentPage ? "page" : undefined}
              className={`${linkBase} ${
                page === currentPage
                  ? "border-emerald-600 bg-emerald-600 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-emerald-600"
              }`}
            >
              {page}
            </Link>
          ))}
          {currentPage < numberOfPages && (
            <Link href={hrefForPage(currentPage + 1)} aria-label="Next page" className={`${linkBase} border-slate-200 bg-white text-slate-600 hover:border-emerald-600`}>
              <ChevronRightIcon className="size-4" />
            </Link>
          )}
        </nav>
      )}
    </>
  );
}
