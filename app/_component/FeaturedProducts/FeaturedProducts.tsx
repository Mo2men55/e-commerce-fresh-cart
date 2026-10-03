"use client";

import { prodType } from "@/app/_interface/product";
import ProductCard from "../ProductCard/ProductCard";

export default function FeaturedProducts({
  products,
}: {
  products: prodType[];
}) {
  return (
    <section
      aria-labelledby="featured-products-title"
      className="mx-auto max-w-7xl"
    >
      <h1
        id="featured-products-title"
        className="mb-6 border-l-4 border-emerald-600 pl-4 text-2xl font-bold text-slate-800"
      >
        Featured <span className="text-emerald-600">Products</span>
      </h1>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
