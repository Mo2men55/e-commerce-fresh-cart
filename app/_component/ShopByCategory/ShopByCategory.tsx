import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import type { Category } from "@/app/_interface/product";

export default function ShopByCategory({
  categories,
}: {
  categories: Category[];
}) {
  return (
    <section aria-labelledby="shop-by-category-title">
      <div className="mb-6 flex items-center justify-between gap-4">
         <h1 id="featured-products-title" className="mb-6 border-l-4  border-emerald-600 pl-4 text-2xl font-bold text-slate-800">
         Shop By <span className="text-emerald-600"> Category</span> 
      </h1>
       
        <Link
          href="/categories"
          className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700"
        >
          View All Categories
          <ArrowRightIcon className="size-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {categories.map((category) => (
          <Link
            key={category._id}
            href={`/products?category=${category._id}`}
            className="group flex flex-col items-center gap-3 text-center"
          >
            <div>
              
            </div>
            <span className="relative flex size-24 items-center justify-center overflow-hidden rounded-full border border-slate-100 bg-white shadow-sm transition group-hover:border-emerald-200 group-hover:shadow-md sm:size-28">
              <Image
                src={category.image}
                alt={category.name}
                fill
                sizes="112px"
                className=" object-contain   group-hover:scale-105"
              />
            </span>
            <span className="text-sm font-medium text-slate-700 group-hover:text-emerald-600">
              {category.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
