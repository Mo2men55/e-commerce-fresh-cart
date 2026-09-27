import Image from "next/image";
import Link from "next/link";
import {
  EnvelopeIcon,
  MapPinIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";

const footerLinks = {
  Shop: [
    { name: "All Products", href: "/products" },
    { name: "Categories", href: "/categories" },
    { name: "Brands", href: "/brands" },
    { name: "Deals", href: "/products" },
  ],
  Account: [
    { name: "My Account", href: "/profile" },
    { name: "Order History", href: "/orders" },
    { name: "Wishlist", href: "/wishlist" },
    { name: "Shopping Cart", href: "/cart" },
  ],
  Support: [
    { name: "Contact Us", href: "#" },
    { name: "Help Center", href: "#" },
    { name: "Shipping Info", href: "#" },
    { name: "Returns", href: "#" },
  ],
  Legal: [
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
    { name: "Cookie Policy", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="mt-auto bg-slate-900 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-6 lg:px-8">
        <div className="lg:col-span-2">
          <div className="bg-white p-2 w-53 flex items-center justify-center rounded ">
            <Image
              src="/images/freshcart-logo.png"
              alt="FreshCart"
              width={160}
              height={48}
              className="h-9 w-auto "
            />
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
            FreshCart brings you quality groceries and everyday essentials with
            fast delivery and great prices.
          </p>
          <ul className="mt-5 space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <PhoneIcon className="size-4 text-emerald-500" />
              +1 (800) 123-4567
            </li>
            <li className="flex items-center gap-2">
              <EnvelopeIcon className="size-4 text-emerald-500" />
              support@freshcart.com
            </li>
            <li className="flex items-start gap-2">
              <MapPinIcon className="mt-0.5 size-4 shrink-0 text-emerald-500" />
              123 Market Street, Cairo, Egypt
            </li>
          </ul>
          <div className="mt-5 flex gap-3">
            {["Facebook", "Twitter", "Instagram"].map((network) => (
              <a
                key={network}
                href="#"
                aria-label={network}
                className="flex size-9 items-center justify-center rounded-full bg-slate-800 text-xs font-semibold text-white hover:bg-emerald-600"
              >
                {network[0]}
              </a>
            ))}
          </div>
        </div>

        {Object.entries(footerLinks).map(([title, links]) => (
          <div key={title}>
            <h3 className="text-sm font-semibold text-white">{title}</h3>
            <ul className="mt-4 space-y-2.5">
              {links.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-emerald-400"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-5 text-sm text-slate-500 sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} FreshCart. All rights reserved.</p>
          <div className="flex items-center gap-3">
            {["VISA", "MC", "PayPal"].map((method) => (
              <span
                key={method}
                className="rounded bg-slate-800 px-2 py-1 text-[10px] font-bold tracking-wide text-slate-300"
              >
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
