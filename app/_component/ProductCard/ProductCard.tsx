"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowPathIcon, EyeIcon, HeartIcon } from "@heroicons/react/24/outline";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { prodType } from "@/app/_interface/product";
import ButtonAddCart from "../ButtonAddCart/ButtonAddCart";
import { toast } from "@/components/ui/toast";

async function addToWishlistRequest(productId: string) {
  const response = await fetch("/api/wishlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId }),
  });

  if (response.status === 401) {
    throw new Error("UNAUTHORIZED");
  }

  if (!response.ok) {
    throw new Error("Failed to add product to wishlist");
  }

  return response.json();
}

export default function ProductCard({ product }: { product: prodType }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const discount = product.priceAfterDiscount
    ? Math.round((1 - product.priceAfterDiscount / product.price) * 100)
    : 0;
  const rating = Math.round(product.ratingsAverage);

  const wishlistMutation = useMutation({
    mutationFn: addToWishlistRequest,
    onSuccess: () => {
      toast.add({
        type: "success",
        title: "Added to wishlist",
        description: "Product saved to your wishlist.",
      });
      queryClient.invalidateQueries({ queryKey: ["getwishlist"] });
    },
    onError: (error: Error) => {
      if (error.message === "UNAUTHORIZED") {
        toast.add({
          type: "error",
          title: "Failed",
          description: "Please log in to add products to your wishlist.",
        });
        router.push("/LogIn");
        return;
      }

      toast.add({
        type: "error",
        title: "Failed",
        description: "Could not add product to wishlist. Please try again.",
      });
    },
  });

  return (
    <article className="group relative flex min-w-0 flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      {discount > 0 && (
        <span className="absolute left-3 top-3 z-10 rounded bg-rose-500 px-2 py-1 text-xs font-semibold text-white">
          -{discount}%
        </span>
      )}
      <div className="relative flex h-60 items-center justify-center bg-white p-5 sm:h-64">
        <Link
          href={`/productDetails/${product.id}`}
          className="flex h-full w-full items-center justify-center"
        >
          <Image
            src={product.imageCover}
            alt={product.title}
            fill
            sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-contain p-5 transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
        <div className="absolute right-3 top-3 flex flex-col gap-2">
          <button
            type="button"
            disabled={wishlistMutation.isPending}
            onClick={() => wishlistMutation.mutate(product._id)}
            aria-label={`Add ${product.title} to wishlist`}
            className="flex size-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm hover:text-rose-500 disabled:opacity-40"
          >
            <HeartIcon className="size-5" />
          </button>
          <button
            type="button"
            aria-label={`Compare ${product.title}`}
            className="flex size-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm hover:text-emerald-600"
          >
            <ArrowPathIcon className="size-5" />
          </button>
          <Link
            href={`/productDetails/${product.id}`}
            aria-label={`View ${product.title}`}
            className="flex size-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm hover:text-emerald-600"
          >
            <EyeIcon className="size-5" />
          </Link>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="mb-1 text-xs text-slate-500">{product.category?.name}</p>
        <Link
          href={`/productDetails/${product.id}`}
          className="line-clamp-2 min-h-12 text-sm font-medium text-slate-700 hover:text-emerald-600"
        >
          {product.title}
        </Link>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-lg tracking-wide text-amber-400">
            {"★".repeat(rating)}
            {"☆".repeat(5 - rating)}
          </span>
          <span className="text-xs text-slate-500">
            {product.ratingsAverage} ({product.ratingsQuantity})
          </span>
        </div>
        <div className="mt-auto flex items-center justify-between pt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-slate-800">
              {product.priceAfterDiscount ?? product.price} EGP
            </span>
            {discount > 0 && (
              <del className="text-xs text-slate-400">{product.price} EGP</del>
            )}
          </div>
          <ButtonAddCart Home={true} ProdId={product._id} />
        </div>
      </div>
    </article>
  );
}
