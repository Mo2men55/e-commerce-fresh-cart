"use client";

import Image from "next/image";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeftIcon,
  CheckBadgeIcon,
  HeartIcon,
  ShoppingCartIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import type { WishlistResponseType } from "@/app/types/wishlist";
import { removeFromWishlist } from "../action/wishlistAction/wishlist";
import { addToCart } from "../action/cartAction/addtoCart";
import { toast } from "@/components/ui/toast";
import TrustFeatures from "../TrustFeatures/TrustFeatures";

function formatPrice(value: number) {
  return value.toLocaleString("en-EG");
}

export default function WishlistComp() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery<WishlistResponseType>({
    queryKey: ["getwishlist"],
    queryFn: async () => {
      const response = await fetch("/api/wishlist");
      if (!response.ok) {
        throw new Error("Failed to fetch wishlist");
      }
      return response.json();
    },
  });

  const invalidateWishlist = () =>
    queryClient.invalidateQueries({ queryKey: ["getwishlist"] });

  const removeMutation = useMutation({
    mutationFn: (productId: string) => removeFromWishlist(productId),
    onSuccess: () => {
      toast.add({
        type: "success",
        title: "Removed",
        description: "Product removed from wishlist.",
      });
      invalidateWishlist();
    },
    onError: () => {
      toast.add({
        type: "error",
        title: "Failed",
        description: "Could not remove product from wishlist.",
      });
    },
  });

  const addCartMutation = useMutation({
    mutationFn: (productId: string) => addToCart(productId),
    onSuccess: () => {
      toast.add({
        type: "success",
        title: "Added to cart",
        description: "Product has been added to your cart.",
      });
      queryClient.invalidateQueries({ queryKey: ["getcart"] });
    },
    onError: () => {
      toast.add({
        type: "error",
        title: "Failed",
        description: "Could not add product to cart. Please check you are logged in.",
      });
    },
  });

  const products = data?.data ?? [];
  const itemCount = data?.count ?? products.length;
  const isMutating = removeMutation.isPending || addCartMutation.isPending;

  if (isLoading) {
    return (
      <main className="bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl animate-pulse space-y-6">
          <div className="h-4 w-40 rounded bg-slate-200" />
          <div className="h-10 w-64 rounded bg-slate-200" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 rounded-2xl bg-white" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="bg-slate-50 px-4 py-16 text-center sm:px-6 lg:px-8">
        <p className="text-slate-600">
          Could not load your wishlist. Please try again.
        </p>
        <Link
          href="/products"
          className="mt-4 inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700"
        >
          <ArrowLeftIcon className="size-4" />
          Continue Shopping
        </Link>
      </main>
    );
  }

  return (
    <>
      <main className="bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <nav className="mb-6 text-sm text-slate-500" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2">
              <li>
                <Link href="/" className="hover:text-emerald-600">
                  Home
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="font-medium text-slate-800">Wishlist</li>
            </ol>
          </nav>

          <div className="mb-8 flex items-start gap-3">
            <span className="mt-1 flex size-11 items-center justify-center rounded-full bg-rose-50 text-rose-500">
              <HeartIcon className="size-6" />
            </span>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">My Wishlist</h1>
              <p className="mt-1 text-slate-500">
                You have {itemCount}{" "}
                {itemCount === 1 ? "item" : "items"} in your wishlist.
              </p>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
              <HeartIcon className="mx-auto size-12 text-slate-300" />
              <h2 className="mt-4 text-xl font-semibold text-slate-800">
                Your wishlist is empty
              </h2>
              <p className="mt-2 text-slate-500">
                Save products you love and find them here later.
              </p>
              <Link
                href="/products"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700"
              >
                <ArrowLeftIcon className="size-4" />
                Continue Shopping
              </Link>
            </div>
          ) : (
            <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
              <div className="hidden grid-cols-[1fr_120px_120px_200px] gap-4 border-b border-slate-100 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-600 md:grid">
                <span>Product</span>
                <span className="text-center">Price</span>
                <span className="text-center">Status</span>
                <span className="text-center">Actions</span>
              </div>

              <ul className="divide-y divide-slate-100">
                {products.map((product) => {
                  const productId = product._id;
                  const inStock = product.quantity > 0;
                  const price = product.priceAfterDiscount ?? product.price;

                  return (
                    <li key={productId}>
                      {/* Desktop / tablet row */}
                      <article className="hidden items-center gap-4 px-5 py-5 md:grid md:grid-cols-[1fr_120px_120px_200px]">
                        <div className="flex min-w-0 items-center gap-4">
                          <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-slate-50">
                            <Image
                              src={product.imageCover}
                              alt={product.title}
                              fill
                              sizes="80px"
                              className="object-contain p-2"
                            />
                          </div>
                          <div className="min-w-0">
                            <h2 className="truncate font-semibold text-slate-900">
                              {product.title}
                            </h2>
                            <p className="mt-0.5 text-sm text-slate-500">
                              {product.brand?.name
                                ? `Sold by: ${product.brand.name}`
                                : product.category?.name}
                            </p>
                          </div>
                        </div>

                        <p className="text-center text-sm font-semibold text-slate-800">
                          {formatPrice(price)} EGP
                        </p>

                        <div className="flex justify-center">
                          {inStock ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                              <CheckBadgeIcon className="size-3.5" />
                              In Stock
                            </span>
                          ) : (
                            <span className="inline-flex rounded-full bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-600">
                              Out of Stock
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            disabled={isMutating || !inStock}
                            onClick={() => addCartMutation.mutate(productId)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-40"
                          >
                            <ShoppingCartIcon className="size-4" />
                            Add to Cart
                          </button>
                          <button
                            type="button"
                            disabled={isMutating}
                            onClick={() => removeMutation.mutate(productId)}
                            className="flex size-9 items-center justify-center rounded-lg text-red-500 hover:bg-red-50 disabled:opacity-40"
                            aria-label={`Remove ${product.title}`}
                          >
                            <TrashIcon className="size-5" />
                          </button>
                        </div>
                      </article>

                      {/* Mobile card */}
                      <article className="flex flex-col gap-4 p-4 md:hidden">
                        <div className="flex gap-4">
                          <div className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-slate-50">
                            <Image
                              src={product.imageCover}
                              alt={product.title}
                              fill
                              sizes="96px"
                              className="object-contain p-2"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <h2 className="line-clamp-2 font-semibold text-slate-900">
                                {product.title}
                              </h2>
                              <button
                                type="button"
                                disabled={isMutating}
                                onClick={() => removeMutation.mutate(productId)}
                                className="flex size-8 shrink-0 items-center justify-center rounded-lg text-red-500 hover:bg-red-50 disabled:opacity-40"
                                aria-label={`Remove ${product.title}`}
                              >
                                <TrashIcon className="size-5" />
                              </button>
                            </div>
                            <p className="mt-1 text-sm font-semibold text-slate-800">
                              {formatPrice(price)} EGP
                            </p>
                            {inStock ? (
                              <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                                <CheckBadgeIcon className="size-3.5" />
                                In Stock
                              </span>
                            ) : (
                              <span className="mt-2 inline-flex rounded-full bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-600">
                                Out of Stock
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          type="button"
                          disabled={isMutating || !inStock}
                          onClick={() => addCartMutation.mutate(productId)}
                          className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-40"
                        >
                          <ShoppingCartIcon className="size-4" />
                          Add to Cart
                        </button>
                      </article>
                    </li>
                  );
                })}
              </ul>

              <div className="border-t border-slate-100 px-5 py-4">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700"
                >
                  <ArrowLeftIcon className="size-4" />
                  Continue Shopping
                </Link>
              </div>
            </section>
          )}
        </div>
      </main>

      <TrustFeatures />
    </>
  );
}
