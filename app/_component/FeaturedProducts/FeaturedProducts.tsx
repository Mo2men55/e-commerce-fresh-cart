"use client"
import Link from "next/link"
import Image from "next/image"
import { ArrowPathIcon, EyeIcon, HeartIcon} from "@heroicons/react/24/outline"
import { prodType } from "@/app/_interface/product"
import ButtonAddCart from "../ButtonAddCart/ButtonAddCart"





function ProductCard({ product }: { product: prodType }) {
  const discount = product.priceAfterDiscount
    ? Math.round((1 - product.priceAfterDiscount / product.price) * 100)
    : 0
  const rating = Math.round(product.ratingsAverage)

  return (
    <article className="group relative flex min-w-0 flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      {discount > 0 && <span className="absolute left-3 top-3 z-10 rounded bg-rose-500 px-2 py-1 text-xs font-semibold text-white">-{discount}%</span>}
      <div className="relative flex h-60 items-center justify-center bg-white p-5 sm:h-64">
        <Link href={`/productDetails/${product.id}`} className="flex h-full w-full items-center justify-center">
          <Image src={product.imageCover} alt={product.title} fill sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="object-contain p-5 transition-transform duration-300 group-hover:scale-105" />
        </Link>
        <div className="absolute right-3 top-3 flex flex-col gap-2">
          <button type="button" aria-label={`Add ${product.title} to wishlist`} className="flex size-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm hover:text-emerald-600"><HeartIcon className="size-5" /></button>
          <button type="button" aria-label={`Compare ${product.title}`} className="flex size-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm hover:text-emerald-600"><ArrowPathIcon className="size-5" /></button>
          <Link href={`/productDetails/${product.id}`} aria-label={`View ${product.title}`} className="flex size-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm hover:text-emerald-600"><EyeIcon className="size-5" /></Link>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="mb-1 text-xs text-slate-500">{product.category?.name}</p>
        <Link href={`/productDetails/${product.id}`} className="line-clamp-2 min-h-12 text-sm font-medium text-slate-700 hover:text-emerald-600">{product.title}</Link>
        <div className="mt-2 flex items-center gap-2"><span className="text-lg tracking-wide text-amber-400">{"★".repeat(rating)}{"☆".repeat(5 - rating)}</span><span className="text-xs text-slate-500">{product.ratingsAverage} ({product.ratingsQuantity})</span></div>
        <div className="mt-auto flex items-center justify-between pt-4">
          <div className="flex items-baseline gap-2"><span className="text-lg font-bold text-slate-800">{product.priceAfterDiscount ?? product.price} EGP</span>{discount > 0 && <del className="text-xs text-slate-400">{product.price} EGP</del>}</div>
          <ButtonAddCart Home={true} ProdId={product._id} />
          {/* <button type="button" aria-label={`Add ${product.title} to cart`} className="flex size-10 items-center justify-center rounded-full bg-emerald-600 text-white hover:bg-emerald-700"><PlusIcon className="size-5" /></button> */}
        </div>
      </div>
    </article>
  )
}

export default function FeaturedProducts({ products }: { products: prodType[] }) {
  return (
    <section aria-labelledby="featured-products-title" className="mx-auto max-w-7xl">
      <h1 id="featured-products-title" className="mb-6 border-l-4 border-emerald-600 pl-4 text-2xl font-bold text-slate-800">
        Featured <span className="text-emerald-600">Products</span> 
      </h1>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        {products.map((product) => <ProductCard key={product.id} product={product} />)}
      </div>
    </section>
  )
}
