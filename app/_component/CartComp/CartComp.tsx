"use client";

import Image from "next/image";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeftIcon,
  ArrowPathIcon,
  CheckBadgeIcon,
  ChevronDownIcon,
  ChatBubbleLeftRightIcon,
  LockClosedIcon,
  MinusIcon,
  PlusIcon,
  ShieldCheckIcon,
  ShoppingCartIcon,
  TrashIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";
import type { CartResponseType } from "@/app/types/getcart";
import {
  clearCart,
  removeCartItem,
  updateCartCount,
} from "../action/cartAction/updateCart";

const FREE_SHIPPING_THRESHOLD = 500;

function formatPrice(value: number) {
  return value.toLocaleString("en-EG");
}

export default function CartComp() {
  const queryClient = useQueryClient();

  const { data: cartdata, isLoading, isError } = useQuery<CartResponseType>({
    queryKey: ["getcart"],
    queryFn: async () => {
      const response = await fetch("/api/cart");
      if (!response.ok) {
        throw new Error("Failed to fetch cart data");
      }
      return response.json();
    },
  });

  const invalidateCart = () =>
    queryClient.invalidateQueries({ queryKey: ["getcart"] });

  const updateMutation = useMutation({
    mutationFn: ({ productId, count }: { productId: string; count: number }) =>
      updateCartCount(productId, count),
    onSuccess: invalidateCart,
  });

  const removeMutation = useMutation({
    mutationFn: (productId: string) => removeCartItem(productId),
    onSuccess: invalidateCart,
  });

  const clearMutation = useMutation({
    mutationFn: clearCart,
    onSuccess: invalidateCart,
  });

  const products = cartdata?.data?.products ?? [];
  const itemCount = cartdata?.numOfCartItems ?? 0;
  const subtotal = cartdata?.data?.totalCartPrice ?? 0;
  const qualifiesFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingProgress = Math.min(
    100,
    Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100),
  );
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const isMutating =
    updateMutation.isPending ||
    removeMutation.isPending ||
    clearMutation.isPending;

  if (isLoading) {
    return (
      <main className="bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl animate-pulse space-y-6">
          <div className="h-4 w-40 rounded bg-slate-200" />
          <div className="h-10 w-64 rounded bg-slate-200" />
          <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 rounded-2xl bg-white" />
              ))}
            </div>
            <div className="h-96 rounded-2xl bg-white" />
          </div>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="bg-slate-50 px-4 py-16 text-center sm:px-6 lg:px-8">
        <p className="text-slate-600">Could not load your cart. Please try again.</p>
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
              <li className="font-medium text-slate-800">Shopping Cart</li>
            </ol>
          </nav>

          <div className="mb-8 flex items-start gap-3">
            <span className="mt-1 flex size-11 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <ShoppingCartIcon className="size-6" />
            </span>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Shopping Cart</h1>
              <p className="mt-1 text-slate-500">
                You have {itemCount} {itemCount === 1 ? "item" : "items"} in your
                cart.
              </p>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
              <ShoppingCartIcon className="mx-auto size-12 text-slate-300" />
              <h2 className="mt-4 text-xl font-semibold text-slate-800">
                Your cart is empty
              </h2>
              <p className="mt-2 text-slate-500">
                Looks like you haven&apos;t added anything yet.
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
            <div className="grid items-start gap-8 lg:grid-cols-[1fr_340px]">
              <section className="space-y-4">
                {products.map((item) => {
                  const productId = item.product._id;
                  const lineTotal = item.price * item.count;
                  const inStock = item.product.quantity > 0;

                  return (
                    <article
                      key={item._id}
                      className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:gap-5 sm:p-5"
                    >
                      <div className="relative mx-auto size-24 shrink-0 overflow-hidden rounded-xl bg-slate-50 sm:mx-0">
                        <Image
                          src={item.product.imageCover}
                          alt={item.product.title}
                          fill
                          sizes="96px"
                          className="object-contain p-2"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h2 className="truncate text-base font-semibold text-slate-900">
                          {item.product.title}
                        </h2>
                        <p className="mt-0.5 text-sm text-emerald-600">
                          {item.product.category?.name ?? item.product.brand?.name}
                        </p>
                        <p className="mt-1 text-sm font-medium text-slate-700">
                          {formatPrice(item.price)} EGP
                        </p>
                        {inStock && (
                          <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                            <CheckBadgeIcon className="size-3.5" />
                            In Stock
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:justify-center">
                        <div className="flex items-center rounded-lg border border-slate-200">
                          <button
                            type="button"
                            disabled={isMutating || item.count <= 1}
                            onClick={() =>
                              updateMutation.mutate({
                                productId,
                                count: item.count - 1,
                              })
                            }
                            className="flex size-9 items-center justify-center text-slate-500 hover:text-emerald-600 disabled:opacity-40"
                            aria-label={`Decrease ${item.product.title} quantity`}
                          >
                            <MinusIcon className="size-4" />
                          </button>
                          <span className="w-8 text-center text-sm font-semibold text-slate-800">
                            {item.count}
                          </span>
                          <button
                            type="button"
                            disabled={isMutating}
                            onClick={() =>
                              updateMutation.mutate({
                                productId,
                                count: item.count + 1,
                              })
                            }
                            className="flex size-9 items-center justify-center text-slate-500 hover:text-emerald-600 disabled:opacity-40"
                            aria-label={`Increase ${item.product.title} quantity`}
                          >
                            <PlusIcon className="size-4" />
                          </button>
                        </div>

                        <div className="flex items-center gap-3">
                          <p className="text-sm font-bold text-slate-900 sm:text-base">
                            {formatPrice(lineTotal)} EGP
                          </p>
                          <button
                            type="button"
                            disabled={isMutating}
                            onClick={() => removeMutation.mutate(productId)}
                            className="flex size-9 items-center justify-center rounded-lg text-red-500 hover:bg-red-50 disabled:opacity-40"
                            aria-label={`Remove ${item.product.title}`}
                          >
                            <TrashIcon className="size-5" />
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700"
                  >
                    <ArrowLeftIcon className="size-4" />
                    Continue Shopping
                  </Link>
                  <button
                    type="button"
                    disabled={isMutating}
                    onClick={() => clearMutation.mutate()}
                    className="inline-flex items-center gap-2 text-sm font-medium text-red-500 hover:text-red-600 disabled:opacity-40"
                  >
                    <TrashIcon className="size-4" />
                    Clear all items
                  </button>
                </div>
              </section>

              <aside className="lg:sticky lg:top-24">
                <div className="overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm">
                  <div className="bg-emerald-600 px-5 py-4">
                    <h2 className="text-lg font-semibold text-white">
                      Order Summary
                    </h2>
                  </div>

                  <div className="space-y-5 p-5">
                    <div className="rounded-xl bg-emerald-50 p-4">
                      {qualifiesFreeShipping ? (
                        <p className="flex items-center gap-2 text-sm font-medium text-emerald-700">
                          <TruckIcon className="size-5 shrink-0" />
                          Free Shipping! You qualify for free delivery.
                        </p>
                      ) : (
                        <>
                          <p className="text-sm text-emerald-800">
                            Add{" "}
                            <strong>{formatPrice(amountToFreeShipping)} EGP</strong>{" "}
                            more for free shipping
                          </p>
                          <div className="mt-2 h-2 overflow-hidden rounded-full bg-emerald-100">
                            <div
                              className="h-full rounded-full bg-emerald-500 transition-all"
                              style={{ width: `${shippingProgress}%` }}
                            />
                          </div>
                        </>
                      )}
                    </div>

                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between text-slate-600">
                        <span>Subtotal</span>
                        <span className="font-medium text-slate-800">
                          {formatPrice(subtotal)} EGP
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Shipping</span>
                        <span className="font-semibold text-emerald-600">
                          {qualifiesFreeShipping ? "FREE" : "Calculated at checkout"}
                        </span>
                      </div>
                      <div className="border-t border-slate-100 pt-3">
                        <div className="flex justify-between text-base">
                          <span className="font-semibold text-slate-900">Total</span>
                          <span className="text-xl font-bold text-slate-900">
                            {formatPrice(subtotal)} EGP
                          </span>
                        </div>
                      </div>
                    </div>

                    <details className="group rounded-xl border border-slate-200">
                      <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-medium text-slate-700">
                        Apply Promo Code
                        <ChevronDownIcon className="size-4 transition group-open:rotate-180" />
                      </summary>
                      <div className="flex gap-2 border-t border-slate-100 p-3">
                        <input
                          type="text"
                          placeholder="Enter code"
                          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                        />
                        <button
                          type="button"
                          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                        >
                          Apply
                        </button>
                      </div>
                    </details>

                    <Link
                      href="/checkout"
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 text-sm font-semibold text-white hover:bg-emerald-700"
                    >
                      <LockClosedIcon className="size-4" />
                      Go to Checkout
                    </Link>

                    <Link
                      href="/products"
                      className="block text-center text-sm text-emerald-600 hover:text-emerald-700"
                    >
                      Continue Shopping
                    </Link>

                    <div className="flex items-center justify-center gap-4 border-t border-slate-100 pt-4">
                      <span className="rounded bg-slate-100 px-2 py-1 text-[10px] font-bold tracking-wide text-slate-600">
                        VISA
                      </span>
                      <span className="rounded bg-slate-100 px-2 py-1 text-[10px] font-bold tracking-wide text-slate-600">
                        Mastercard
                      </span>
                      <span className="rounded bg-slate-100 px-2 py-1 text-[10px] font-bold tracking-wide text-slate-600">
                        PayPal
                      </span>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          )}
        </div>
      </main>

      <section className="border-y border-emerald-100 bg-emerald-50/60 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: TruckIcon,
              title: "Free Shipping",
              text: "On orders over 500 EGP",
            },
            {
              icon: ArrowPathIcon,
              title: "Easy Returns",
              text: "30-day return policy",
            },
            {
              icon: ShieldCheckIcon,
              title: "Secure Payment",
              text: "100% protected checkout",
            },
            {
              icon: ChatBubbleLeftRightIcon,
              title: "24/7 Support",
              text: "We're here to help",
            },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-center gap-3">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white text-emerald-600 shadow-sm">
                <Icon className="size-6" />
              </span>
              <div>
                <p className="font-semibold text-slate-800">{title}</p>
                <p className="text-sm text-slate-500">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
