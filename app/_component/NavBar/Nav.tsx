"use client";

import { FormEvent, useState } from "react";
import {
  Bars3Icon,
  ChevronDownIcon,
  EnvelopeIcon,
  GiftIcon,
  HeartIcon,
  ArrowRightOnRectangleIcon,
  ChatBubbleLeftRightIcon,
  MagnifyingGlassIcon,
  PhoneIcon,
  ShoppingCartIcon,
  TruckIcon,
  UserIcon,
  UserPlusIcon,
  XMarkIcon,
  IdentificationIcon,
} from "@heroicons/react/24/outline";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { CartResponseType } from "@/app/types/getcart";
import { WishlistResponseType } from "@/app/types/wishlist";
import { useQuery } from "@tanstack/react-query";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/products" },
  { name: "Categories", href: "/categories", hasDropdown: true },
  { name: "Brands", href: "/brands" },
];

const categories = [
  { name: "All Categories", href: "/categories" },
  { name: "Music", href: "/music" },
  { name: "Men's Fashion", href: "/menfashion" },
  { name: "Women's Fashion", href: "/womenfashion" },
  { name: "Super Market", href: "/supermarket" },
  { name: "Mobiles", href: "/mobile" },
  { name: "Books", href: "/book" },
  { name: "Home", href: "/home" },
];

export default function Nav() {
  const session = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { data: cartdata } = useQuery<CartResponseType>({
    queryKey: ["getcart"],
    queryFn: async () => {
      const response = await fetch("/api/cart");
      if (!response.ok) {
        throw new Error("Failed to fetch cart data");
      }
      return response.json();
    },
  });
  const { data: wishlistdata } = useQuery<WishlistResponseType>({
    queryKey: ["getwishlist"],
    queryFn: async () => {
      const response = await fetch("/api/wishlist");
      if (!response.ok) {
        throw new Error("Failed to fetch wishlist");
      }
      return response.json();
    },
    enabled: session.status === "authenticated",
  });

  function Logouthandler() {
    signOut({ callbackUrl: "/LogIn", redirect: true });
  }

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const keyword = searchQuery.trim();
    setOpen(false);
    router.push(
      keyword
        ? `/products?keyword=${encodeURIComponent(keyword)}`
        : "/products",
    );
  }

  return (
    <>
      {/* Top bar scrolls away; keep it outside sticky header */}
      <div className="border-b border-slate-100 bg-white text-slate-700">
        <div className="mx-auto flex items-center justify-between px-4 py-2 text-sm sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <TruckIcon className="size-4 text-emerald-600" />
              Free Shipping on Orders 500 EGP
            </span>
            <span className="hidden items-center gap-2 sm:flex">
              <GiftIcon className="size-4 text-emerald-600" />
              New Arrivals Daily
            </span>
          </div>
          <div className="hidden items-center gap-4 lg:flex">
            <span className="flex items-center gap-1">
              <PhoneIcon className="size-4" />
              +1 (800) 123-4567
            </span>
            <span className="flex items-center gap-1">
              <EnvelopeIcon className="size-4" />
              support@freshcart.com
            </span>
            {session.status === "authenticated" ? null : (
              <>
                <Link
                  href="/LogIn"
                  className="flex items-center gap-1 border-l border-slate-200 pl-4 hover:text-emerald-600"
                >
                  <UserIcon className="size-4" />
                  Sign In
                </Link>
                <Link
                  href="/SignUp"
                  className="flex items-center gap-1 hover:text-emerald-600"
                >
                  <UserPlusIcon className="size-4" />
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-50 w-full shrink-0 border-b border-slate-100 bg-white">
          <nav
            aria-label="Main navigation"
            className="mx-auto  px-4 sm:px-6 lg:px-8"
          >
            <div className="flex min-h-20 items-center gap-4">
              <Link href="/" className="shrink-0">
                <Image
                  src="/images/freshcart-logo.png"
                  alt="FreshCart Logo"
                  width={300}
                  height={100}
                  className="h-10 w-auto"
                />
              </Link>

              <div className="hidden flex-1 lg:block">
                <form
                  onSubmit={handleSearch}
                  className="mx-auto flex max-w-xl items-center rounded-full border border-slate-200 bg-slate-50 px-5 py-2"
                >
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for products, brands and more..."
                    className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                    aria-label="Search products"
                  />
                  <button
                    type="submit"
                    className="flex size-9 items-center justify-center rounded-full bg-emerald-600 text-white"
                    aria-label="Search"
                  >
                    <MagnifyingGlassIcon className="size-5" />
                  </button>
                </form>
              </div>

              <div className="hidden items-center gap-7 lg:flex">
                {navigation.map((item) =>
                  item.hasDropdown ? (
                    <div key={item.name} className="relative">
                      <button
                        type="button"
                        onClick={() => setCategoriesOpen((isOpen) => !isOpen)}
                        className="flex items-center gap-1 text-sm font-medium hover:text-emerald-600"
                        aria-expanded={categoriesOpen}
                        aria-haspopup="true"
                      >
                        {item.name}
                        <ChevronDownIcon
                          className={`size-4 transition-transform ${categoriesOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                      {categoriesOpen && (
                        <div className="absolute right-0 top-full z-30 mt-4 w-48 overflow-hidden rounded-xl bg-white py-2 shadow-lg ring-1 ring-slate-100">
                          {categories.map((category) => (
                            <Link
                              key={category.name}
                              href={category.href}
                              onClick={() => setCategoriesOpen(false)}
                              className="block px-4 py-3 text-sm hover:bg-emerald-50 hover:text-emerald-600"
                            >
                              {category.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center gap-1 text-sm font-medium hover:text-emerald-600"
                    >
                      {item.name}
                    </Link>
                  ),
                )}
              </div>

              <div className="ml-auto flex items-center gap-4">
                <div className="hidden items-center gap-2 text-xs lg:flex">
                  <span className="flex size-10 items-center justify-center rounded-full bg-emerald-50">
                    <ChatBubbleLeftRightIcon className="size-5 text-emerald-600" />
                  </span>
                  <span>
                    <span className="block text-slate-400">Support</span>
                    <strong>24/7 Help</strong>
                  </span>
                </div>

                {session.status === "authenticated" ? (
                  <>
                    {" "}
                    <Link
                      href="/wishlist"
                      className="relative"
                      aria-label="Wishlist"
                    >
                      <HeartIcon className="size-6 text-slate-500 hover:text-emerald-600" />
                      <span className="absolute -right-2 -top-2 flex size-4 items-center justify-center rounded-full bg-rose-500 text-[10px] text-white">
                        {wishlistdata?.count ?? wishlistdata?.data?.length ?? 0}
                      </span>
                    </Link>
                    <Link
                      href="/cart"
                      className="relative"
                      aria-label="Shopping cart"
                    >
                      <ShoppingCartIcon className="size-6 text-slate-500 hover:text-emerald-600" />
                      <span className="absolute -right-2 -top-2 flex size-4 items-center justify-center rounded-full bg-emerald-600 text-[10px] text-white">
                        {cartdata?.numOfCartItems || 0}
                      </span>
                    </Link>
                    <Link
                      href="/profile"
                      className="relative"
                      aria-label="Shopping cart"
                    >
                      <IdentificationIcon className="size-8 text-slate-500 hover:text-emerald-600" />
                    </Link>
                    <button
                      onClick={Logouthandler}
                      className="hidden items-center gap-2 rounded-full bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700 sm:flex"
                    >
                      Log Out
                    </button>{" "}
                  </>
                ) : (
                  <>
                    {" "}
                    <Link
                      href="/LogIn"
                      className="hidden items-center gap-2 rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700 sm:flex"
                    >
                      <UserIcon className="size-4" />
                      Sign In
                    </Link>
                  </>
                )}
              </div>

              <button
                type="button"
                onClick={() => setOpen(true)}
                className="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white transition-colors hover:bg-emerald-700 lg:hidden"
                aria-label="Open menu"
                aria-expanded={open}
                aria-controls="mobile-nav-panel"
              >
                <Bars3Icon className="size-5" />
              </button>
            </div>

            <form
              onSubmit={handleSearch}
              className="mb-4 flex items-center rounded-full border border-slate-200 bg-slate-50 px-4 py-2 focus-within:border-emerald-600 lg:hidden"
            >
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products, brands and more..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                aria-label="Search products"
              />
              <button type="submit" aria-label="Search">
                <MagnifyingGlassIcon className="size-5 text-emerald-600" />
              </button>
            </form>
          </nav>
        </header>

        <Dialog
          open={open}
          onClose={setOpen}
          className="relative z-50 lg:hidden"
        >
          <DialogBackdrop className="fixed inset-0 bg-black/30" />
          <DialogPanel
            id="mobile-nav-panel"
            className="fixed inset-y-0 right-0 w-80 max-w-[85%] overflow-y-auto bg-white p-6 shadow-xl"
          >
            <div className="mb-8 flex items-center justify-between">
              <span className="text-xl font-bold text-slate-800">
                FreshCart
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
              >
                <XMarkIcon className="size-6 text-slate-500" />
              </button>
            </div>
            <div className="flex flex-col gap-6">
              {navigation.map((item) =>
                item.hasDropdown ? (
                  <div key={item.name}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between text-base font-medium"
                    >
                      {item.name}
                      <ChevronDownIcon className="size-4" />
                    </Link>
                    <div className="mt-4 space-y-3 border-l border-slate-200 pl-4">
                      {categories.map((category) => (
                        <Link
                          key={category.name}
                          href={category.href}
                          onClick={() => setOpen(false)}
                          className="block text-sm text-slate-500 hover:text-emerald-600"
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between text-base font-medium"
                  >
                    {item.name}
                  </Link>
                ),
              )}

              {session.status === "authenticated" ? (
                <>
                  <div className="space-y-2 border-t border-slate-100 pt-5">
                    <Link
                      href="/wishlist"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-2 py-2 text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
                    >
                      <span className="flex size-9 items-center justify-center rounded-full bg-rose-50">
                        <HeartIcon className="size-5 text-rose-500" />
                      </span>
                      <span className="flex-1">Wishlist</span>
                      <span className="text-xs text-slate-500">
                        {wishlistdata?.count ?? wishlistdata?.data?.length ?? 0}
                      </span>
                    </Link>
                    <Link
                      href="/cart"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-2 py-2 text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
                    >
                      <span className="flex size-9 items-center justify-center rounded-full bg-emerald-50">
                        <ShoppingCartIcon className="size-5 text-emerald-600" />
                      </span>
                      <span className="flex-1">Cart</span>
                      <span className="text-xs text-slate-500">
                        {cartdata?.numOfCartItems ?? 0}
                      </span>
                    </Link>
                  </div>

                  <div className="space-y-2 border-t border-slate-100 pt-5">
                    <Link
                      href="/profile"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-2 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      <span className="flex size-9 items-center justify-center rounded-full bg-slate-100">
                        <IdentificationIcon className="size-5 text-slate-500" />
                      </span>
                      {session.data?.user?.name || "My Account"}
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        Logouthandler();
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50"
                    >
                      <span className="flex size-9 items-center justify-center rounded-full bg-rose-50">
                        <ArrowRightOnRectangleIcon className="size-5" />
                      </span>
                      Sign Out
                    </button>
                  </div>
                </>
              ) : session.status === "unauthenticated" ? (
                <div className="space-y-3 border-t border-slate-100 pt-5">
                  <Link
                    href="/LogIn"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
                  >
                    <UserIcon className="size-5" />
                    Sign In
                  </Link>
                  <Link
                    href="/SignUp"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <UserPlusIcon className="size-5" />
                    Sign Up
                  </Link>
                </div>
              ) : null}
            </div>
          </DialogPanel>
        </Dialog>
    </>
  );
}
