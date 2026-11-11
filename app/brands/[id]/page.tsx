import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBrandById } from "@/app/_component/Service/BrandApi";
import { getProducts } from "@/app/_component/Service/ProductApi";
import CollectionProducts from "@/app/_component/CollectionProducts/CollectionProducts";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const brand = await getBrandById(id);
  return { title: brand ? `${brand.name} | FreshCart` : "Brand | FreshCart" };
}

export default async function BrandDetailsPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { page = "1" } = await searchParams;

  const brand = await getBrandById(id);
  if (!brand) notFound();

  const products = await getProducts({ brand: id, page, limit: 20 });

  return (
    <main className="min-h-screen bg-[#F9FAFB]">
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <nav className="mb-6 text-sm text-slate-500" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2">
            <li><Link href="/" className="hover:text-emerald-600">Home</Link></li>
            <li aria-hidden>/</li>
            <li><Link href="/brands" className="hover:text-emerald-600">Brands</Link></li>
            <li aria-hidden>/</li>
            <li className="font-medium text-slate-800">{brand.name}</li>
          </ol>
        </nav>
      </div>

      <section className="bg-violet-600 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center gap-5">
          <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-2xl bg-white p-2 shadow-sm sm:h-24 sm:w-32">
            <Image src={brand.image} alt={brand.name} fill sizes="128px" className="object-contain p-2" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white sm:text-4xl">{brand.name}</h1>
            <p className="mt-2 text-violet-100">
              {products.results} product{products.results === 1 ? "" : "s"} from {brand.name}
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <CollectionProducts
          products={products.data}
          currentPage={products.metadata?.currentPage ?? Number(page)}
          numberOfPages={products.metadata?.numberOfPages ?? 1}
          hrefForPage={(p) => `/brands/${id}${p > 1 ? `?page=${p}` : ""}`}
          emptyText="This brand has no products yet."
        />
      </div>
    </main>
  );
}
