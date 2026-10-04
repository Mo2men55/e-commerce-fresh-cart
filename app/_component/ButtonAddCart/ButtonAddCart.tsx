"use client";

import { PlusIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
import React from "react";
import { toast } from "@/components/ui/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

async function addToCartRequest(productId: string) {
  const response = await fetch("/api/cart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId }),
  });

  if (response.status === 401) {
    throw new Error("UNAUTHORIZED");
  }

  if (!response.ok) {
    throw new Error("Failed to add product to cart");
  }

  return response.json();
}

export default function ButtonAddCart({
  Home,
  ProdId,
}: {
  Home: boolean;
  ProdId: string;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: addToCartRequest,
    onSuccess: () => {
      toast.add({
        type: "success",
        title: "Success",
        description: "The product has been successfully added to your cart.",
      });
      queryClient.invalidateQueries({ queryKey: ["getcart"] });
    },
    onError: (error: Error) => {
      if (error.message === "UNAUTHORIZED") {
        toast.add({
          type: "error",
          title: "Please log in",
          description: "You need to be logged in to add products to your cart.",
        });
        router.push("/LogIn");
        return;
      }

      toast.add({
        type: "error",
        title: "Failed to add product to cart",
        description:
          "There was an error adding the product to your cart. Please try again.",
      });
    },
  });

  function handleAddToCart() {
    mutate(ProdId);
  }

  return (
    <>
      {Home ? (
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isPending}
          aria-label={`Add  to cart`}
          className="flex size-10 items-center justify-center rounded-full bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60"
        >
          <PlusIcon className="size-5" />
        </button>
      ) : (
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isPending}
          aria-label={`Add  to cart`}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-4 font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
        >
          <ShoppingCartIcon className="size-5" />
          Add to Cart
        </button>
      )}
    </>
  );
}
