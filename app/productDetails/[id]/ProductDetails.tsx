"use client"

import Image from "next/image"
import { useState } from "react"
import {
  BoltIcon,
  CheckCircleIcon,
  HeartIcon,
  MinusIcon,
  PlusIcon,
  ShareIcon,
  ShieldCheckIcon,
  TruckIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline"
import { prodType } from "@/app/_interface/product"
import ButtonAddCart from "@/app/_component/ButtonAddCart/ButtonAddCart"


export default function ProductDetails({ product }: { product: prodType }) {
  const images = [product.imageCover, ...(product.images ?? [])].filter((image, index, list) => list.indexOf(image) === index)
  const [selectedImage, setSelectedImage] = useState(images[0])
  const [quantity, setQuantity] = useState(1)
  const rating = Math.round(product.ratingsAverage)
  const unitPrice = product.priceAfterDiscount ?? product.price

  return (
    <main className="bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:p-8">
        <div className="grid gap-8 lg:grid-cols-[350px_1fr]">
          <section>
            <div className="relative flex h-[430px] items-center justify-center rounded-lg bg-white p-6">
              <Image src={selectedImage} alt={product.title} fill sizes="(min-width: 1024px) 350px, 100vw" className="object-contain p-5" priority />
            </div>
            <div className="mt-5 flex gap-3 overflow-x-auto pb-1">
              {images.map((image, index) => (
                <button key={image} type="button" onClick={() => setSelectedImage(image)} aria-label={`Show product image ${index + 1}`} className={`relative size-20 shrink-0 overflow-hidden rounded border-2 bg-white ${selectedImage === image ? "border-blue-600" : "border-slate-200"}`}>
                  <Image src={image} alt={`${product.title} thumbnail ${index + 1}`} fill sizes="80px" className="object-contain p-1" />
                </button>
              ))}
            </div>
          </section>

          <section className="flex flex-col pt-1">
            <p className="text-sm text-slate-500">{product.category?.name}</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">{product.title}</h1>
            <div className="mt-3 flex items-center gap-2">
              <span className="text-xl tracking-wide text-amber-400">{"★".repeat(rating)}{"☆".repeat(5 - rating)}</span>
              <span className="text-sm text-slate-600">{product.ratingsAverage} ({product.ratingsQuantity} reviews)</span>
            </div>
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-slate-900">{unitPrice} EGP</span>
              {product.priceAfterDiscount && <del className="text-slate-400">{product.price} EGP</del>}
            </div>
            <span className="mt-5 flex w-fit items-center gap-1 rounded-full bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700"><CheckCircleIcon className="size-4" />In Stock</span>

            <div className="my-6 border-t border-slate-100 pt-5 text-sm leading-7 text-slate-600">
              <p><strong className="font-medium text-slate-800">Description:</strong> {product.description}</p>
              <p><strong className="font-medium text-slate-800">Brand:</strong> {product.brand?.name}</p>
            </div>

            <div>
              <label htmlFor="quantity" className="text-sm font-medium text-slate-700">Quantity</label>
              <div className="mt-2 flex items-center gap-4">
                <div className="flex items-center rounded-lg border border-slate-200">
                  <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="flex size-12 items-center justify-center text-slate-500 hover:text-emerald-600" aria-label="Decrease quantity"><MinusIcon className="size-4" /></button>
                  <span id="quantity" className="w-10 text-center">{quantity}</span>
                  <button type="button" onClick={() => setQuantity((value) => Math.min(product.quantity, value + 1))} className="flex size-12 items-center justify-center text-slate-500 hover:text-emerald-600" aria-label="Increase quantity"><PlusIcon className="size-4" /></button>
                </div>
                <span className="text-sm text-slate-500">{product.quantity} available</span>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <ButtonAddCart Home={false} ProdId={product._id} />
              
              <button type="button" className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-slate-900 px-5 py-4 font-semibold text-white hover:bg-slate-800"><BoltIcon className="size-5" />Buy Now</button>
            </div>
            <div className="mt-4 flex gap-3">
              <button type="button" className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 py-3 text-sm text-slate-700 hover:border-emerald-600 hover:text-emerald-600"><HeartIcon className="size-5" />Add to Wishlist</button>
              <button type="button" aria-label="Share product" className="flex size-12 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:border-emerald-600 hover:text-emerald-600"><ShareIcon className="size-5" /></button>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 border-t border-slate-100 pt-5 text-sm sm:grid-cols-3">
              <span className="flex items-center gap-2"><TruckIcon className="size-6 text-emerald-600" /><span><strong className="block">Free Delivery</strong>Fast delivery</span></span>
              <span className="flex items-center gap-2"><ArrowPathIcon className="size-6 text-emerald-600" /><span><strong className="block">30 Days Return</strong>Easy returns</span></span>
              <span className="flex items-center gap-2"><ShieldCheckIcon className="size-6 text-emerald-600" /><span><strong className="block">Secure Payment</strong>100% secure</span></span>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
