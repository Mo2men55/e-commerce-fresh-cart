import Image from "next/image";
import Link from "next/link";
import { FolderIcon } from "@heroicons/react/24/outline";
import { getAllCategories } from "../_component/Service/CategoryApi";
import TrustFeatures from "../_component/TrustFeatures/TrustFeatures";

export default async function CategoriesPage() {
  const categories = await getAllCategories();

  return (
    <>
      <main className="min-h-screen bg-[#F9FAFB]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <nav className="mb-6 text-sm text-slate-500" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2">
              <li>
                <Link href="/" className="hover:text-emerald-600">
                  Home
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="font-medium text-slate-800">Categories</li>
            </ol>
          </nav>
        </div>

        <section className="bg-emerald-600 px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-row gap-4 items-center">
            <span className="mb-3 flex size-12 items-center justify-center rounded-full bg-white/15 text-white">
              <FolderIcon className="size-6" />
            </span>
            <div>
            <h1 className="text-3xl font-bold text-white sm:text-4xl">
              All Categories
            </h1>
            <p className="mt-2 text-emerald-50">
              Browse our wide range of product categories.
            </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {categories.map((category) => (
              <Link
                key={category._id}
                href={`/products?category=${category._id}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
              >
                <div className="relative aspect-square bg-slate-50">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    sizes="(min-width: 1280px) 20vw, (min-width: 768px) 25vw, 50vw"
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="px-3 py-4 text-center">
                  <h2 className="text-sm font-semibold text-slate-800 group-hover:text-emerald-600 sm:text-base">
                    {category.name}
                  </h2>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <TrustFeatures />
    </>
  );
}
