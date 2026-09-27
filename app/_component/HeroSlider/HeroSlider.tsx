"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const slides = [
  {
    id: 1,
    title: "Fresh Products Delivered to your Door",
    subtitle: "Get 20% off your first order",
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1920&q=80",
    primaryHref: "/products",
    primaryLabel: "Shop Now",
    secondaryHref: "/products",
    secondaryLabel: "View Deals",
  },
  {
    id: 2,
    title: "Organic Groceries for Everyday Living",
    subtitle: "Save more on weekly essentials",
    image:
      "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=1920&q=80",
    primaryHref: "/products",
    primaryLabel: "Shop Now",
    secondaryHref: "/categories",
    secondaryLabel: "Browse Categories",
  },
  {
    id: 3,
    title: "Farm Fresh Picks, Ready When You Are",
    subtitle: "Free shipping on orders over 500 EGP",
    image:
      "https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1920&q=80",
    primaryHref: "/products",
    primaryLabel: "Shop Now",
    secondaryHref: "/brands",
    secondaryLabel: "View Brands",
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  function goTo(index: number) {
    setCurrent((index + slides.length) % slides.length);
  }

  return (
    <section
      aria-label="Promotional slider"
      className="relative overflow-hidden rounded-2xl"
    >
      <div className="relative h-[320px] sm:h-[380px] lg:h-[440px]">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === current ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            aria-hidden={index !== current}
          >
            <Image
              src={slide.image}
              alt=""
              fill
              priority={index === 0}
              sizes="(min-width: 1280px) 1280px, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-r from-emerald-950/80 via-emerald-800/55 to-emerald-600/25" />

            <div className="relative z-10 flex h-full max-w-xl flex-col justify-center px-8 sm:px-12 lg:px-16">
              <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
                {slide.title}
              </h1>
              <p className="mt-3 text-base text-emerald-50 sm:text-lg">
                {slide.subtitle}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={slide.primaryHref}
                  className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-emerald-50"
                >
                  {slide.primaryLabel}
                </Link>
                <Link
                  href={slide.secondaryHref}
                  className="rounded-lg border border-white/80 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
                >
                  {slide.secondaryLabel}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => goTo(current - 1)}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 z-20 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow hover:bg-white sm:left-4"
      >
        <ChevronLeftIcon className="size-5" />
      </button>
      <button
        type="button"
        onClick={() => goTo(current + 1)}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 z-20 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow hover:bg-white sm:right-4"
      >
        <ChevronRightIcon className="size-5" />
      </button>

      <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => goTo(index)}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === current}
            className={`h-2.5 rounded-full transition-all ${
              index === current
                ? "w-6 bg-white"
                : "w-2.5 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
