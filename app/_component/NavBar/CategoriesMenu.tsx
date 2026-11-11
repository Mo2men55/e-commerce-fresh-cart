"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowRightIcon, ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import type { MenuCategory } from "@/app/api/categories-menu/route";

function useCategoriesMenu() {
  return useQuery<MenuCategory[]>({
    queryKey: ["categories-menu"],
    queryFn: async () => {
      const res = await fetch("/api/categories-menu");
      if (!res.ok) throw new Error("Failed to load categories");
      return (await res.json()).data;
    },
    staleTime: 60 * 60 * 1000,
  });
}

const categoryHref = (id: string) => `/categories/${id}`;
const subHref = (categoryId: string, subId: string) => `/categories/${categoryId}?sub=${subId}`;

/* ------------------------------------------------------------------ */
/* Desktop: mega menu (categories left, hovered category's subs right) */
/* ------------------------------------------------------------------ */

export function CategoriesMegaMenu({ label }: { label: string }) {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { data: categories = [], isLoading, isError } = useCategoriesMenu();

  const active = categories.find((c) => c._id === activeId) ?? categories[0];

  // Close on route change, outside click and Escape.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1 text-sm font-medium hover:text-emerald-600 ${pathname.startsWith("/categories") ? "text-emerald-600" : ""}`}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {label}
        <ChevronDownIcon className={`size-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute left-1/2 top-full z-30 mt-4 w-[640px] -translate-x-1/2 overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-slate-100">
          {isLoading ? (
            <div className="grid grid-cols-[220px_1fr] gap-4 p-4">
              <div className="space-y-2">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className="h-9 animate-pulse rounded-lg bg-slate-100" />
                ))}
              </div>
              <div className="h-full animate-pulse rounded-xl bg-slate-50" />
            </div>
          ) : isError || categories.length === 0 ? (
            <div className="p-6 text-center text-sm text-slate-500">
              Couldn&apos;t load categories.{" "}
              <Link href="/categories" className="font-medium text-emerald-600 hover:underline">
                Browse all categories
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-[220px_1fr]">
              <ul className="max-h-[420px] overflow-y-auto border-r border-slate-100 bg-slate-50/60 p-2">
                {categories.map((category) => {
                  const isActive = active?._id === category._id;
                  return (
                    <li key={category._id}>
                      <Link
                        href={categoryHref(category._id)}
                        onMouseEnter={() => setActiveId(category._id)}
                        onFocus={() => setActiveId(category._id)}
                        className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm transition ${
                          isActive ? "bg-white font-semibold text-emerald-700 shadow-sm" : "text-slate-700 hover:bg-white"
                        }`}
                      >
                        <span className="truncate">{category.name}</span>
                        {category.subcategories.length > 0 && (
                          <ChevronRightIcon className={`size-4 shrink-0 ${isActive ? "text-emerald-600" : "text-slate-300"}`} />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              {active && (
                <div className="flex flex-col p-5">
                  <div className="flex items-center gap-3">
                    <div className="relative size-12 shrink-0 overflow-hidden rounded-xl bg-slate-50">
                      <Image src={active.image} alt="" fill sizes="48px" className="object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-900">{active.name}</p>
                      <p className="text-xs text-slate-500">
                        {active.subcategories.length} subcategor{active.subcategories.length === 1 ? "y" : "ies"}
                      </p>
                    </div>
                  </div>

                  {active.subcategories.length > 0 ? (
                    <ul className="mt-4 grid grid-cols-2 gap-1">
                      {active.subcategories.map((sub) => (
                        <li key={sub._id}>
                          <Link
                            href={subHref(active._id, sub._id)}
                            className="block truncate rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
                          >
                            {sub.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-4 text-sm text-slate-400">No subcategories — see all products in this category.</p>
                  )}

                  <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4 text-sm">
                    <Link href={categoryHref(active._id)} className="flex items-center gap-1 font-semibold text-emerald-600 hover:underline">
                      Shop all {active.name} <ArrowRightIcon className="size-4" />
                    </Link>
                    <Link href="/categories" className="text-slate-500 hover:text-emerald-600">
                      All categories
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Mobile: accordion inside the slide-out menu                         */
/* ------------------------------------------------------------------ */

export function CategoriesAccordion({ label, onNavigate }: { label: string; onNavigate: () => void }) {
  const [open, setOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { data: categories = [], isLoading } = useCategoriesMenu();

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between text-base font-medium"
      >
        {label}
        <ChevronDownIcon className={`size-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="mt-4 space-y-1 border-l border-slate-200 pl-4">
          <Link href="/categories" onClick={onNavigate} className="block py-1.5 text-sm font-medium text-emerald-600">
            All Categories
          </Link>
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => <div key={i} className="my-2 h-4 w-32 animate-pulse rounded bg-slate-100" />)
            : categories.map((category) => {
                const expanded = expandedId === category._id;
                const hasSubs = category.subcategories.length > 0;
                return (
                  <div key={category._id}>
                    <div className="flex items-center justify-between">
                      <Link href={categoryHref(category._id)} onClick={onNavigate} className="flex-1 py-1.5 text-sm text-slate-600 hover:text-emerald-600">
                        {category.name}
                      </Link>
                      {hasSubs && (
                        <button
                          type="button"
                          onClick={() => setExpandedId(expanded ? null : category._id)}
                          aria-expanded={expanded}
                          aria-label={`${expanded ? "Hide" : "Show"} ${category.name} subcategories`}
                          className="rounded p-1.5 text-slate-400 hover:bg-slate-100"
                        >
                          <ChevronDownIcon className={`size-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
                        </button>
                      )}
                    </div>
                    {expanded && (
                      <div className="mb-2 ml-1 space-y-1 border-l border-emerald-100 pl-3">
                        {category.subcategories.map((sub) => (
                          <Link
                            key={sub._id}
                            href={subHref(category._id, sub._id)}
                            onClick={onNavigate}
                            className="block py-1 text-sm text-slate-500 hover:text-emerald-600"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
        </div>
      )}
    </div>
  );
}
