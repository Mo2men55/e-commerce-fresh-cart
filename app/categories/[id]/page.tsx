import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategoryById } from "@/app/_component/Service/CategoryApi";
import { getSubcategoriesOfCategory } from "@/app/_component/Service/SubCategoryApi";
import { getProducts } from "@/app/_component/Service/ProductApi";
import CollectionProducts from "@/app/_component/CollectionProducts/CollectionProducts";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ sub?: string; page?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const category = await getCategoryById(id);
  return { title: category ? `${category.name} | FreshCart` : "Category | FreshCart" };
}

export default async function CategoryDetailsPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { sub, page = "1" } = await searchParams;

  const [category, subcategories] = await Promise.all([
    getCategoryById(id),
    getSubcategoriesOfCategory(id).catch(() => []),
  ]);
  if (!category) notFound();

  const activeSub = subcategories.find((s) => s._id === sub);
  const products = await getProducts({
    category: id,
    subcategory: activeSub?._id,
    page,
    limit: 20,
  });

  const href = (opts: { sub?: string; page?: number }) => {
    const q = new URLSearchParams();
    if (opts.sub) q.set("sub", opts.sub);
    if (opts.page && opts.page > 1) q.set("page", String(opts.page));
    const qs = q.toString();
    return `/categories/${id}${qs ? `?${qs}` : ""}`;
  };

  const pill = "shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition";

  return (
    <main className="min-h-screen bg-[#F9FAFB]">
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <nav className="mb-6 text-sm text-slate-500" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2">
            <li><Link href="/" className="hover:text-emerald-600">Home</Link></li>
            <li aria-hidden>/</li>
            <li><Link href="/categories" className="hover:text-emerald-600">Categories</Link></li>
            <li aria-hidden>/</li>
            <li className="font-medium text-slate-800">{category.name}</li>
          </ol>
        </nav>
      </div>

      <section className="bg-emerald-600 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center gap-5">
          <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl bg-white shadow-sm sm:size-24">
            <Image src={category.image} alt={category.name} fill sizes="96px" className="object-cover" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white sm:text-4xl">{category.name}</h1>
            <p className="mt-2 text-emerald-50">
              {products.results} product{products.results === 1 ? "" : "s"}
              {subcategories.length > 0 && ` · ${subcategories.length} subcategories`}
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {subcategories.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Shop by subcategory</h2>
            <div className="flex gap-2 overflow-x-auto pb-2">
              <Link
                href={href({})}
                className={`${pill} ${!activeSub ? "border-emerald-600 bg-emerald-600 text-white" : "border-slate-200 bg-white text-slate-700 hover:border-emerald-600 hover:text-emerald-700"}`}
              >
                All
              </Link>
              {subcategories.map((s) => (
                <Link
                  key={s._id}
                  href={href({ sub: s._id })}
                  className={`${pill} ${activeSub?._id === s._id ? "border-emerald-600 bg-emerald-600 text-white" : "border-slate-200 bg-white text-slate-700 hover:border-emerald-600 hover:text-emerald-700"}`}
                >
                  {s.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        <CollectionProducts
          products={products.data}
          currentPage={products.metadata?.currentPage ?? Number(page)}
          numberOfPages={products.metadata?.numberOfPages ?? 1}
          hrefForPage={(p) => href({ sub: activeSub?._id, page: p })}
          emptyText={activeSub ? `Nothing in ${activeSub.name} yet — try another subcategory.` : "This category has no products yet."}
        />
      </div>
    </main>
  );
}
