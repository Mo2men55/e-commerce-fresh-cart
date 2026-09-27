import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

const banners = [
  {
    badge: "Deal of the Day",
    title: "Fresh Organic Fruits",
    text: "Get up to 40% off on selected organic fruits",
    offer: "40% OFF",
    code: "ORGANIC40",
    href: "/products",
    cta: "Shop Now",
    className:
      "bg-linear-to-br from-emerald-600 via-emerald-500 to-teal-500",
  },
  {
    badge: "New Arrivals",
    title: "Exotic Vegetables",
    text: "Discover our latest collection of premium vegetables",
    offer: "25% OFF",
    code: "FRESH25",
    href: "/products",
    cta: "Explore Now",
    className:
      "bg-linear-to-br from-orange-500 via-orange-500 to-rose-500",
  },
];

export default function PromoBanners() {
  return (
    <section
      aria-label="Promotional offers"
      className="grid gap-5 lg:grid-cols-2"
    >
      {banners.map((banner) => (
        <article
          key={banner.code}
          className={`relative overflow-hidden rounded-2xl p-6 text-white shadow-sm sm:p-8 ${banner.className}`}
        >
          <div className="pointer-events-none absolute -right-8 -top-8 size-40 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-10 right-10 size-32 rounded-full bg-white/10" />

          <span className="inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
            {banner.badge}
          </span>
          <h3 className="mt-4 text-2xl font-bold sm:text-3xl">{banner.title}</h3>
          <p className="mt-2 max-w-sm text-sm text-white/90 sm:text-base">
            {banner.text}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span className="rounded-lg bg-white/20 px-3 py-1.5 text-sm font-bold backdrop-blur-sm">
              {banner.offer}
            </span>
            <span className="text-sm text-white/90">
              Use code: <strong>{banner.code}</strong>
            </span>
          </div>

          <Link
            href={banner.href}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-emerald-50"
          >
            {banner.cta}
            <ArrowRightIcon className="size-4" />
          </Link>
        </article>
      ))}
    </section>
  );
}
