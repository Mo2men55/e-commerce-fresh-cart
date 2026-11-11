"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BuildingOffice2Icon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  HomeModernIcon,
  MapPinIcon,
  PhoneIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { toast } from "@/components/ui/toast";
import type { Address, AddressInput, AddressesResponse } from "@/app/types/address";

const sidebarLinks = [
  { name: "All Orders", href: "/allorders", icon: ClipboardDocumentListIcon },
  { name: "My Addresses", href: "/address", icon: MapPinIcon, active: true },
  { name: "Settings", href: "/profile", icon: Cog6ToothIcon },
];

const CITIES = [
  "Cairo", "Giza", "Alexandria", "Qalyubia", "Sharqia", "Dakahlia", "Gharbia",
  "Monufia", "Beheira", "Kafr El Sheikh", "Damietta", "Port Said", "Ismailia",
  "Suez", "Fayoum", "Beni Suef", "Minya", "Asyut", "Sohag", "Qena", "Luxor",
  "Aswan", "Red Sea", "Matrouh", "North Sinai", "South Sinai", "New Valley",
];

const EMPTY: AddressInput = { name: "", details: "", phone: "", city: "" };

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  const payload = await res.json().catch(() => null);
  if (res.status === 401) throw new Error("UNAUTHORIZED");
  if (!res.ok) throw new Error(payload?.message ?? "Something went wrong");
  return payload as T;
}

function validate(v: AddressInput) {
  const errors: Partial<Record<keyof AddressInput, string>> = {};
  if (!v.name.trim()) errors.name = "Give this address a label";
  if (!v.city) errors.city = "Choose a city";
  if (v.details.trim().length < 5) errors.details = "Add street, building and apartment";
  if (!/^01[0125][0-9]{8}$/.test(v.phone)) errors.phone = "Enter a valid Egyptian number (01XXXXXXXXX)";
  return errors;
}

function AddressForm({
  pending,
  onSubmit,
  onCancel,
}: {
  pending: boolean;
  onSubmit: (v: AddressInput) => void;
  onCancel: () => void;
}) {
  const [values, setValues] = useState<AddressInput>(EMPTY);
  const [errors, setErrors] = useState<ReturnType<typeof validate>>({});

  const set = (key: keyof AddressInput) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setValues((v) => ({ ...v, [key]: e.target.value }));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length === 0) onSubmit(values);
  }

  const inputClass =
    "h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Add a new address</h3>
        <button type="button" onClick={onCancel} aria-label="Close form" className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
          <XMarkIcon className="size-5" />
        </button>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {["Home", "Work", "Other"].map((label) => (
          <button
            key={label}
            type="button"
            onClick={() => setValues((v) => ({ ...v, name: label }))}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
              values.name === label
                ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                : "border-slate-200 text-slate-600 hover:border-slate-300"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Label" error={errors.name}>
          <input value={values.name} onChange={set("name")} placeholder="e.g. Home, Mom's house" className={inputClass} />
        </Field>
        <Field label="City" error={errors.city}>
          <select value={values.city} onChange={set("city")} className={inputClass}>
            <option value="">Select a city</option>
            {CITIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </Field>
        <Field label="Phone" error={errors.phone}>
          <input value={values.phone} onChange={set("phone")} inputMode="tel" maxLength={11} placeholder="01XXXXXXXXX" className={inputClass} />
        </Field>
        <Field label="Address details" error={errors.details} wide>
          <textarea
            value={values.details}
            onChange={set("details")}
            rows={3}
            placeholder="Street, building number, floor, apartment, landmark"
            className={`${inputClass} h-auto resize-none py-2.5`}
          />
        </Field>
      </div>

      <div className="mt-5 flex gap-3">
        <button type="submit" disabled={pending} className="rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60">
          {pending ? "Saving..." : "Save address"}
        </button>
        <button type="button" onClick={onCancel} className="rounded-lg border border-slate-200 px-6 py-2.5 text-sm font-medium text-slate-700 hover:border-slate-300">
          Cancel
        </button>
      </div>
    </form>
  );
}

function Field({ label, error, wide, children }: { label: string; error?: string; wide?: boolean; children: React.ReactNode }) {
  return (
    <label className={`block ${wide ? "sm:col-span-2" : ""}`}>
      <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-500">{error}</span>}
    </label>
  );
}

function AddressCard({ address, onDelete, deleting }: { address: Address; onDelete: () => void; deleting: boolean }) {
  const lower = address.name.toLowerCase();
  const Icon = lower.includes("work") || lower.includes("office") ? BuildingOffice2Icon : lower.includes("home") ? HomeModernIcon : MapPinIcon;

  return (
    <article className={`group flex flex-col rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:border-emerald-200 hover:shadow-md ${deleting ? "opacity-50" : ""}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <Icon className="size-6" />
          </span>
          <div>
            <h3 className="font-semibold text-slate-900">{address.name}</h3>
            <p className="text-sm text-slate-500">{address.city}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onDelete}
          disabled={deleting}
          aria-label={`Delete ${address.name} address`}
          className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
        >
          <TrashIcon className="size-5" />
        </button>
      </div>
      <p className="mt-4 flex-1 text-sm leading-6 text-slate-600" dir="auto">{address.details}</p>
      <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4 text-sm text-slate-600">
        <PhoneIcon className="size-4 text-slate-400" />
        <span dir="ltr">{address.phone}</span>
      </div>
    </article>
  );
}

export default function AddressesComp() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Same cache key + shape (Address[]) as the checkout page, so both stay in sync.
  const { data: addresses = [], isLoading, isError } = useQuery<Address[]>({
    queryKey: ["addresses"],
    queryFn: async () => (await request<AddressesResponse>("/api/addresses")).data ?? [],
  });

  function onError(error: Error) {
    if (error.message === "UNAUTHORIZED") {
      router.push("/LogIn");
      return;
    }
    toast.add({ type: "error", title: "Something went wrong", description: error.message });
  }

  // Both add and delete return the full updated list, so we write it straight to the cache.
  const addMutation = useMutation({
    mutationFn: (input: AddressInput) =>
      request<AddressesResponse>("/api/addresses", { method: "POST", body: JSON.stringify(input) }),
    onSuccess: (res) => {
      queryClient.setQueryData<Address[]>(["addresses"], res.data ?? []);
      setShowForm(false);
      toast.add({ type: "success", title: "Address saved", description: "You can pick it at checkout." });
    },
    onError,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => request<AddressesResponse>(`/api/addresses/${id}`, { method: "DELETE" }),
    onMutate: (id) => setDeletingId(id),
    onSuccess: (res) => {
      queryClient.setQueryData<Address[]>(["addresses"], res.data ?? []);
      toast.add({ type: "success", title: "Address removed", description: "The address was deleted." });
    },
    onError,
    onSettled: () => setDeletingId(null),
  });

  function handleDelete(address: Address) {
    if (window.confirm(`Delete "${address.name}" address?`)) deleteMutation.mutate(address._id);
  }

  return (
    <main className="min-h-screen bg-[#F9FAFB]">
      <section className="bg-emerald-600 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center gap-4">
          <span className="flex size-12 items-center justify-center rounded-full bg-white/15 text-white">
            <MapPinIcon className="size-6" />
          </span>
          <div>
            <h1 className="text-3xl font-bold text-white">My Addresses</h1>
            <p className="mt-1 text-emerald-50">Save delivery addresses for a faster checkout.</p>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[260px_1fr] lg:px-8">
        <aside className="h-fit rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <h2 className="mb-3 px-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Account Menu</h2>
          <nav className="space-y-1">
            {sidebarLinks.map(({ name, href, icon: Icon, active }) => (
              <Link
                key={name}
                href={href}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                  active ? "bg-emerald-50 text-emerald-700" : "text-slate-600 hover:bg-slate-50 hover:text-emerald-600"
                }`}
              >
                <Icon className="size-5" />
                {name}
              </Link>
            ))}
          </nav>
        </aside>

        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Saved addresses</h2>
              <p className="text-sm text-slate-500">
                {isLoading ? "Loading..." : `${addresses.length} address${addresses.length === 1 ? "" : "es"}`}
              </p>
            </div>
            {!showForm && (
              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                <PlusIcon className="size-5" /> Add address
              </button>
            )}
          </div>

          {showForm && (
            <AddressForm pending={addMutation.isPending} onSubmit={(v) => addMutation.mutate(v)} onCancel={() => setShowForm(false)} />
          )}

          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2">
              {[1, 2].map((i) => (
                <div key={i} className="h-48 animate-pulse rounded-2xl bg-white" />
              ))}
            </div>
          ) : isError ? (
            <p className="rounded-2xl bg-white p-8 text-center text-sm text-red-600">Couldn&apos;t load your addresses. Please refresh.</p>
          ) : addresses.length === 0 ? (
            !showForm && (
              <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white px-6 py-14 text-center">
                <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <MapPinIcon className="size-7" />
                </span>
                <h3 className="mt-4 font-semibold text-slate-900">No saved addresses yet</h3>
                <p className="mt-1 text-sm text-slate-500">Add one now and skip typing it at checkout.</p>
                <button
                  type="button"
                  onClick={() => setShowForm(true)}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  <PlusIcon className="size-5" /> Add your first address
                </button>
              </div>
            )
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {addresses.map((address) => (
                <AddressCard
                  key={address._id}
                  address={address}
                  deleting={deletingId === address._id}
                  onDelete={() => handleDelete(address)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
