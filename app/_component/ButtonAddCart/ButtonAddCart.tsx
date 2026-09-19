import { PlusIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
import React from "react";
import { addToCart } from "../action/cartAction/addtoCart";
import { toast } from "@/components/ui/toast";

export default function ButtonAddCart({
  Home,
  ProdId,
}: {
  Home: boolean;
  ProdId: string;
}) {
  async function handleAddToCart() {
    try {
      const data = await addToCart(ProdId);

      if (data.status === "success") {
        toast.add({
          title: "Product added to cart",
          description: "The product has been successfully added to your cart.",
        });
      }else{
         toast.add({
        title: "Failed to add product to cart",
        description:
          "There was an error adding the product to your cart. Please try again.",
      });
      }
    } catch (error) {
      toast.add({
        title: "Failed to add product to cart",
        description:
          "There was an error adding the product to your cart. Please try again.",
      });
    }
  }
  return (
    <>
      {Home ? (
        <>
          <button
            type="button"
            onClick={handleAddToCart}
            aria-label={`Add  to cart`}
            className="flex size-10 items-center justify-center rounded-full bg-emerald-600 text-white hover:bg-emerald-700"
          >
            <PlusIcon className="size-5" />
          </button>
        </>
      ) : (
        <>
          <button
            type="button"
            onClick={handleAddToCart}
            aria-label={`Add  to cart`}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-4 font-semibold text-white hover:bg-emerald-700"
          >
            <ShoppingCartIcon className="size-5" />
            Add to Cart
          </button>
        </>
      )}
    </>
  );
}
