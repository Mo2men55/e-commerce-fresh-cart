"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation"; // App Router (was next/router)
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";

import {
  ArrowLeftIcon,
  ArrowPathIcon,
  BanknotesIcon,
  BookmarkIcon,
  BuildingOffice2Icon,
  CheckIcon,
  ClipboardDocumentListIcon,
  CreditCardIcon,
  InformationCircleIcon,
  MapPinIcon,
  PhoneIcon,
  PlusIcon,
  ShieldCheckIcon,
  ShoppingBagIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";
import { Hash } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { CartResponseType } from "@/app/types/getcart";
import {
  paymentCash,
  paymentOnline,
  ShippingAddress,
} from "../_component/action/paymentAction/paymentCash";
import { toast } from "@/components/ui/toast";

type SavedAddress = {
  _id: string;
  name: string;
  details: string;
  phone: string;
  city: string;
};

type PaymentType = "cash" | "card";

export default function CheckoutForm({ cartId }: { cartId: string }) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentType>("cash");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ShippingAddress>({
    defaultValues: { details: "", phone: "", city: "", postalCode: "" },
  });

  /* ---------- data ---------- */
  const { data: cartdata, isLoading } = useQuery<CartResponseType>({
    queryKey: ["getcart"],
    queryFn: async () => {
      const res = await fetch("/api/cart");
      if (!res.ok) throw new Error("Failed to fetch cart data");
      return res.json();
    },
  });

  // TODO: point this at your own addresses route. Fails quietly -> empty list.
  const { data: savedAddresses = [], isLoading: isAddressesLoading } = useQuery<SavedAddress[]>({
    queryKey: ["addresses"],
    queryFn: async () => {
      const res = await fetch("/api/addresses");
      if (!res.ok) return [];
      const json = await res.json();
      return json.data ?? [];
    },
  });

  const products = cartdata?.data?.products ?? [];
  const subtotal = cartdata?.data?.totalCartPrice ?? 0;

  /* ---------- saved address helpers ---------- */
  const selectAddress = (a: SavedAddress) => {
    setSelectedAddressId(a._id);
    setValue("city", a.city, { shouldValidate: true });
    setValue("details", a.details, { shouldValidate: true });
    setValue("phone", a.phone, { shouldValidate: true });
  };

  const clearAddress = () => {
    setSelectedAddressId(null);
    reset({ city: "", details: "", phone: "", postalCode: "" });
  };

  /* ---------- submit ---------- */
  async function onSubmit(values: ShippingAddress) {
    try {
      setIsSubmitting(true);

      if (paymentMethod === "cash") {
        const payload = await paymentCash(cartId, values);
        if (payload?.status && payload.status !== "success") {
          toast.add({
                type: "error",
                title: "Failed to add product to cart",
                description: "Something went wrong, please try again",
              });
          throw new Error(payload.message ?? "Could not place your order");
        }
        toast.add({
        type: "success",
        title: "Success",
        description: "Order placed successfully ",
      });
 
        router.push("/allorders");
      } else {
        const payload = await paymentOnline(cartId, values);
        if (payload?.status && payload.status !== "success") {
          toast.add({
                type: "error",
                title: "Failed to add product to cart",
                description: "Something went wrong, please try again",
              });
          throw new Error(payload.message ?? "Could not place your order");
        }
        toast.add({
        type: "success",
        title: "Success",
        description: "Order placed successfully 🎉",
      });
        router.push(payload.session.url);
      }
    } catch (err) {
      toast.add({
                type: "error",
                title: "Failed to add product to cart",
                description: "Something went wrong, please try again",
              });
     
    } finally {
      setIsSubmitting(false);
    }
  }

  /* ---------- render ---------- */
  return (
    <main className="bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <nav className="mb-6 text-sm text-slate-500" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2">
            <li><Link href="/" className="hover:text-emerald-600">Home</Link></li>
            <li aria-hidden>/</li>
            <li><Link href="/cart" className="hover:text-emerald-600">Cart</Link></li>
            <li aria-hidden>/</li>
            <li className="font-medium text-slate-800">Checkout</li>
          </ol>
        </nav>

        <div className="mb-8 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="mt-1 flex size-11 items-center justify-center rounded-xl bg-emerald-600 text-white">
              <ClipboardDocumentListIcon className="size-6" />
            </span>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Complete Your Order</h1>
              <p className="mt-1 text-slate-500">Review your items and complete your purchase</p>
            </div>
          </div>
          <Link
            href="/cart"
            className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600 hover:text-emerald-700"
          >
            <ArrowLeftIcon className="size-4" />
            Back to Cart
          </Link>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[1fr_340px]">
          <div className="space-y-6">
            {/* ===== Shipping address Form ===== */}
            <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <Card
                icon={<BuildingOffice2Icon className="size-5" />}
                title="Shipping Address"
                subtitle="Where should we deliver your order?"
              >
                <div className="space-y-5 p-5">
                  {/* Saved addresses */}
                  {isAddressesLoading ? (
                    <div className="space-y-3">
                      <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
                      <div className="h-20 animate-pulse rounded-xl bg-slate-100" />
                    </div>
                  ) : (
                    savedAddresses.length > 0 && (
                      <div className="space-y-3">
                        <div>
                          <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                            <BookmarkIcon className="size-4 text-emerald-600" />
                            Saved Addresses
                          </h3>
                          <p className="mt-1 text-xs text-slate-500">
                            Select a saved address or enter a new one below
                          </p>
                        </div>
                        {savedAddresses.map((a) => {
                          const active = selectedAddressId === a._id;
                          return (
                            <button
                              key={a._id}
                              type="button"
                              onClick={() => selectAddress(a)}
                              className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left transition ${
                                active
                                  ? "border-emerald-600 bg-emerald-50/60"
                                  : "border-slate-200 hover:border-emerald-300"
                              }`}
                            >
                              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                                <MapPinIcon className="size-4" />
                              </span>
                              <span className="min-w-0 text-xs text-slate-500">
                                <span className="block text-sm font-semibold text-slate-900">{a.name}</span>
                                <span className="block truncate">{a.details}</span>
                                <span className="mt-1 flex gap-2">
                                  <Chip icon={<PhoneIcon className="size-3" />}>{a.phone}</Chip>
                                  <Chip icon={<BuildingOffice2Icon className="size-3" />}>{a.city}</Chip>
                                </span>
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )
                  )}

                  <button
                    type="button"
                    onClick={clearAddress}
                    className="flex w-full items-center gap-3 rounded-xl border border-dashed border-emerald-400 bg-emerald-50/50 p-3 text-left hover:bg-emerald-50"
                  >
                    <span className="flex size-9 items-center justify-center rounded-lg bg-emerald-600 text-white">
                      <PlusIcon className="size-5" />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-emerald-800">Use a different address</span>
                      <span className="block text-xs text-slate-500">Enter a new shipping address manually</span>
                    </span>
                  </button>

                  <div className="flex items-start gap-3 rounded-xl bg-emerald-50 p-3">
                    <InformationCircleIcon className="mt-0.5 size-4 shrink-0 text-sky-500" />
                    <div className="text-xs">
                      <p className="font-semibold text-slate-800">Delivery Information</p>
                      <p className="text-sky-600">Please ensure your address is accurate for smooth delivery</p>
                    </div>
                  </div>

                  {/* City */}
                  <FieldWrap label="City" htmlFor="city" error={errors.city?.message}>
                    <div className="relative">
                      <BuildingOffice2Icon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                      <Controller
                        control={control}
                        name="city"
                        rules={{ required: "City is required" }}
                        render={({ field }) => (
                          <Input
                            {...field}
                            id="city"
                            placeholder="e.g. Cairo, Alexandria, Giza"
                            className="h-11 pl-10"
                            aria-invalid={Boolean(errors.city)}
                          />
                        )}
                      />
                    </div>
                  </FieldWrap>

                  {/* Street / details */}
                  <FieldWrap label="Street Address" htmlFor="details" error={errors.details?.message}>
                    <div className="relative">
                      <MapPinIcon className="pointer-events-none absolute left-3 top-3 size-4 text-slate-400" />
                      <Controller
                        control={control}
                        name="details"
                        rules={{
                          required: "Street address is required",
                          minLength: { value: 8, message: "Add more detail (building, floor, apartment)" },
                        }}
                        render={({ field }) => (
                          <textarea
                            {...field}
                            id="details"
                            rows={3}
                            placeholder="Street name, building number, floor, apartment..."
                            aria-invalid={Boolean(errors.details)}
                            className="w-full resize-none rounded-md border border-input bg-transparent px-3 py-2.5 pl-10 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive"
                          />
                        )}
                      />
                    </div>
                  </FieldWrap>

                  {/* Phone */}
                  <FieldWrap label="Phone Number" htmlFor="phone" error={errors.phone?.message}>
                    <div className="relative">
                      <PhoneIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                      <Controller
                        control={control}
                        name="phone"
                        rules={{ required: "Phone number is required" }}
                        render={({ field }) => (
                          <Input
                            {...field}
                            id="phone"
                            type="tel"
                            inputMode="numeric"
                            maxLength={11}
                            placeholder="01xxxxxxxxx"
                            className="h-11 pl-10 pr-36"
                            aria-invalid={Boolean(errors.phone)}
                            onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ""))}
                          />
                        )}
                      />
                      <span className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 text-[11px] text-slate-400 sm:block">
                        Egyptian numbers only
                      </span>
                    </div>
                  </FieldWrap>

                  {/* Postal Code */}
                  <FieldWrap label="Postal Code" htmlFor="postalCode" error={errors.postalCode?.message}>
                    <div className="relative">
                      <Hash className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                      <Controller
                        control={control}
                        name="postalCode"
                        rules={{ required: "Postal code is required" }}
                        render={({ field }) => (
                          <Input
                            {...field}
                            id="postalCode"
                            type="tel"
                            inputMode="numeric"
                            maxLength={8}
                            placeholder="12685"
                            className="h-11 pl-10 pr-36"
                            aria-invalid={Boolean(errors.postalCode)}
                          />
                        )}
                      />
                      <span className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 text-[11px] text-slate-400 sm:block">
                        Egyptian only
                      </span>
                    </div>
                  </FieldWrap>
                </div>
              </Card>
            </form>

            {/* ===== Payment ===== */}
            <Card
              icon={<CreditCardIcon className="size-5" />}
              title="Payment Method"
              subtitle="Choose how you'd like to pay"
            >
              <div className="space-y-3 p-5" role="radiogroup" aria-label="Payment method">
                <PaymentOption
                  active={paymentMethod === "cash"}
                  onClick={() => setPaymentMethod("cash")}
                  icon={<BanknotesIcon className="size-5" />}
                  title="Cash on Delivery"
                  desc="Pay when your order arrives at your doorstep"
                />
                <PaymentOption
                  active={paymentMethod === "card"}
                  onClick={() => setPaymentMethod("card")}
                  icon={<CreditCardIcon className="size-5" />}
                  title="Pay Online"
                  desc="Secure payment with Credit/Debit Card via Stripe"
                />
                <div className="flex items-center gap-3 rounded-xl bg-emerald-50 p-3">
                  <ShieldCheckIcon className="size-5 shrink-0 text-emerald-600" />
                  <div className="text-xs">
                    <p className="font-semibold text-emerald-800">Secure &amp; Encrypted</p>
                    <p className="text-emerald-700/80">Your payment info is protected with 256-bit SSL encryption</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* ===== Order summary ===== */}
          <aside className="lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm">
              <div className="bg-emerald-600 px-5 py-4 text-white">
                <h2 className="flex items-center gap-2 text-lg font-semibold">
                  <ShoppingBagIcon className="size-5" />
                  Order Summary
                </h2>
                <p className="text-xs text-emerald-100">{cartdata?.numOfCartItems ?? 0} items</p>
              </div>

              <div className="space-y-4 p-5">
                {isLoading ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-16 animate-pulse rounded-xl bg-slate-100" />
                    ))}
                  </div>
                ) : (
                  <ul className="max-h-60 space-y-2 overflow-y-auto pr-1">
                    {products.map((item) => (
                      <li key={item._id} className="flex items-center gap-3 rounded-xl bg-slate-50 p-2">
                        <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-white">
                          <Image
                            src={item.product.imageCover}
                            alt={item.product.title}
                            fill
                            sizes="48px"
                            className="object-contain p-1"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-slate-900">{item.product.title}</p>
                          <p className="text-xs text-slate-500">{item.count} × {item.price} EGP</p>
                        </div>
                        <span className="text-sm font-semibold text-slate-900">{item.price * item.count}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="space-y-3 border-t border-slate-100 pt-4 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-medium text-slate-800">{subtotal} EGP</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <TruckIcon className="size-4" />
                      Shipping
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between border-t border-slate-100 pt-3">
                    <span className="font-semibold text-slate-900">Total</span>
                    <span className="text-xl font-bold text-emerald-600">
                      {subtotal} <span className="text-xs font-normal text-slate-400">EGP</span>
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  form="checkout-form"
                  disabled={isSubmitting || isLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <ArrowPathIcon className="size-4 animate-spin" />
                      Placing order...
                    </>
                  ) : (
                    <>
                      <ShoppingBagIcon className="size-4" />
                      Place Order
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1"><ShieldCheckIcon className="size-3.5 text-emerald-600" />Secure</span>
                  <span className="flex items-center gap-1"><TruckIcon className="size-3.5 text-sky-500" />Fast Delivery</span>
                  <span className="flex items-center gap-1"><ArrowPathIcon className="size-3.5 text-orange-500" />Easy Returns</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

/* ---------- helpers (kept OUTSIDE the component so inputs don't remount/lose focus) ---------- */

function Card({
  icon, title, subtitle, children,
}: { icon: React.ReactNode; title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm">
      <div className="bg-emerald-600 px-5 py-4 text-white">
        <h2 className="flex items-center gap-2 text-lg font-semibold">{icon}{title}</h2>
        <p className="text-xs text-emerald-100">{subtitle}</p>
      </div>
      {children}
    </section>
  );
}

function FieldWrap({
  label, htmlFor, error, children,
}: { label: string; htmlFor: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold text-slate-700">
        {label} <span className="text-red-500">*</span>
      </label>
      {children}
      {error && <p role="alert" className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function Chip({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-1.5 py-0.5 text-[11px] text-slate-600">
      {icon}{children}
    </span>
  );
}

function PaymentOption({
  active, onClick, icon, title, desc,
}: { active: boolean; onClick: () => void; icon: React.ReactNode; title: string; desc: string }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${
        active ? "border-emerald-600 bg-emerald-50/60" : "border-slate-200 hover:border-emerald-300"
      }`}
    >
      <span className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${active ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-500"}`}>
        {icon}
      </span>
      <span className="flex-1">
        <span className="block text-sm font-semibold text-slate-900">{title}</span>
        <span className="block text-xs text-slate-500">{desc}</span>
      </span>
      <span className={`flex size-5 items-center justify-center rounded-full border ${active ? "border-emerald-600 bg-emerald-600 text-white" : "border-slate-300"}`}>
        {active && <CheckIcon className="size-3.5" strokeWidth={3} />}
      </span>
    </button>
  );
}