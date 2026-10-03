import Image from "next/image";
import Link from "next/link";
import { TagIcon } from "@heroicons/react/24/outline";
import { getAllBrands } from "../_component/Service/BrandApi";
import TrustFeatures from "../_component/TrustFeatures/TrustFeatures";

export default async function BrandsPage() {
  const brands = await getAllBrands();

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
              <li className="font-medium text-slate-800">Brands</li>
            </ol>
          </nav>
        </div>

        <section className="bg-violet-600 px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-row gap-4 items-center ">
            <span className="mb-3 flex size-12 items-center justify-center rounded-full bg-white/15 text-white">
              <TagIcon className="size-6" />
            </span>
            <div>
            <h1 className="text-3xl font-bold text-white sm:text-4xl">
              Top Brands
            </h1>
            <p className="mt-2 text-violet-100">
              Shop from your favorite brands.
            </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {brands.map((brand) => (
              <Link
                key={brand._id}
                href={`/products?brand=${brand._id}`}
                className="group flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-md"
              >
                <div className="relative h-16 w-full sm:h-20">
                  <Image
                    src={brand.image}
                    alt={brand.name}
                    fill
                    sizes="160px"
                    className="object-contain transition duration-300 group-hover:scale-105"
                  />
                </div>
                <h2 className="text-center text-sm font-semibold text-slate-800 group-hover:text-violet-600">
                  {brand.name}
                </h2>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <TrustFeatures />
    </>
  );
}
