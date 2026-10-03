"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeftIcon,
  ChevronDownIcon,
  ClipboardDocumentListIcon,
  MapPinIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";
import type { OrderType } from "@/app/types/orders";
import TrustFeatures from "../TrustFeatures/TrustFeatures";

function formatPrice(value: number) {
  return value.toLocaleString("en-EG");
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-EG", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function StatusBadge({ order }: { order: OrderType }) {
  if (order.isDelivered) {
    return (
      <span className="rounded-full bg-sky-100 px-2.5 py-1 text-xs font-semibold text-sky-700">
        Delivered
      </span>
    );
  }
  if (order.isPaid) {
    return (
      <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
        Paid
      </span>
    );
  }
  return (
    <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
      Processing
    </span>
  );
}

function OrderCard({ order }: { order: OrderType }) {
  const [open, setOpen] = useState(false);
  const subtotal = order.cartItems.reduce(
    (sum, item) => sum + item.price * item.count,
    0,
  );

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <ClipboardDocumentListIcon className="size-6" />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-semibold text-slate-900">
                Order #{order.id ?? order._id.slice(-6)}
              </h2>
              <StatusBadge order={order} />
            </div>
            <p className="mt-1 text-sm text-slate-500">
              {formatDate(order.createdAt)} ·{" "}
              <span className="capitalize">{order.paymentMethodType}</span>
            </p>
            <p className="mt-1 text-base font-bold text-slate-900">
              {formatPrice(order.totalOrderPrice)} EGP
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
            open
              ? "bg-emerald-600 text-white hover:bg-emerald-700"
              : "border border-slate-200 text-slate-700 hover:border-emerald-300 hover:text-emerald-700"
          }`}
        >
          {open ? "Hide" : "Details"}
          <ChevronDownIcon
            className={`size-4 transition ${open ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-100 bg-slate-50/60 p-4 sm:p-5">
          <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr_1fr]">
            <div className="rounded-xl border border-slate-100 bg-white p-4">
              <h3 className="mb-3 text-sm font-semibold text-slate-800">
                Order Items
              </h3>
              <ul className="space-y-3">
                {order.cartItems.map((item) => (
                  <li key={item._id} className="flex items-center gap-3">
                    <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-slate-50">
                      <Image
                        src={item.product.imageCover}
                        alt={item.product.title}
                        fill
                        sizes="56px"
                        className="object-contain p-1"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-800">
                        {item.product.title}
                      </p>
                      <p className="text-xs text-slate-500">
                        {item.count} × {formatPrice(item.price)} EGP
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-slate-800">
                      {formatPrice(item.price * item.count)} EGP
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-slate-100 bg-white p-4">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800">
                <MapPinIcon className="size-4 text-sky-600" />
                Delivery Address
              </h3>
              <div className="space-y-1 text-sm text-slate-600">
                <p>{order.shippingAddress?.details}</p>
                <p>{order.shippingAddress?.city}</p>
                <p>{order.shippingAddress?.phone}</p>
                {order.shippingAddress?.postalCode && (
                  <p>Postal: {order.shippingAddress.postalCode}</p>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
              <h3 className="mb-3 text-sm font-semibold text-slate-800">
                Order Summary
              </h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between text-slate-600">
                  <dt>Subtotal</dt>
                  <dd>{formatPrice(subtotal)} EGP</dd>
                </div>
                <div className="flex justify-between text-slate-600">
                  <dt>Shipping</dt>
                  <dd>
                    {order.shippingPrice === 0
                      ? "FREE"
                      : `${formatPrice(order.shippingPrice)} EGP`}
                  </dd>
                </div>
                {order.taxPrice > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <dt>Tax</dt>
                    <dd>{formatPrice(order.taxPrice)} EGP</dd>
                  </div>
                )}
                <div className="flex justify-between border-t border-amber-200 pt-2 text-base font-bold text-slate-900">
                  <dt>Total</dt>
                  <dd>{formatPrice(order.totalOrderPrice)} EGP</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

export default function OrdersComp() {
  const { data, isLoading, isError } = useQuery<{ data: OrderType[] }>({
    queryKey: ["getorders"],
    queryFn: async () => {
      const response = await fetch("/api/orders");
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      return response.json();
    },
  });

  const orders = data?.data ?? [];

  if (isLoading) {
    return (
      <main className="bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl animate-pulse space-y-6">
          <div className="h-4 w-40 rounded bg-slate-200" />
          <div className="h-10 w-64 rounded bg-slate-200" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 rounded-2xl bg-white" />
          ))}
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-[#F8F9FA] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <nav className="mb-6 text-sm text-slate-500" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2">
              <li>
                <Link href="/" className="hover:text-emerald-600">
                  Home
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link href="/profile" className="hover:text-emerald-600">
                  My Account
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="font-medium text-slate-800">My Orders</li>
            </ol>
          </nav>

          <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="mt-1 flex size-11 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <ShoppingBagIcon className="size-6" />
              </span>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">My Orders</h1>
                <p className="mt-1 text-slate-500">
                  Easily track and manage your orders.
                </p>
              </div>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Continue Shopping
            </Link>
          </div>

          {isError ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
              <p className="text-slate-600">
                Could not load your orders. Please try again.
              </p>
              <Link
                href="/profile"
                className="mt-4 inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700"
              >
                <ArrowLeftIcon className="size-4" />
                Back to Profile
              </Link>
            </div>
          ) : orders.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
              <ShoppingBagIcon className="mx-auto size-12 text-slate-300" />
              <h2 className="mt-4 text-xl font-semibold text-slate-800">
                No orders yet
              </h2>
              <p className="mt-2 text-slate-500">
                When you place an order, it will show up here.
              </p>
              <Link
                href="/products"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <OrderCard key={order._id} order={order} />
              ))}
            </div>
          )}
        </div>
      </main>

      <TrustFeatures />
    </>
  );
}
