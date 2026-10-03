"use server";

import { getTokenFun } from "@/app/_utilites/getToken";

export async function addToWishlist(productId: string) {
  const token = await getTokenFun();
  if (!token) {
    throw new Error("User is not authenticated");
  }

  const response = await fetch(
    `https://ecommerce.routemisr.com/api/v1/wishlist`,
    {
      method: "POST",
      body: JSON.stringify({ productId }),
      headers: {
        token,
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to add product to wishlist");
  }

  return response.json();
}

export async function removeFromWishlist(productId: string) {
  const token = await getTokenFun();
  if (!token) {
    throw new Error("User is not authenticated");
  }

  const response = await fetch(
    `https://ecommerce.routemisr.com/api/v1/wishlist/${productId}`,
    {
      method: "DELETE",
      headers: {
        token,
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to remove product from wishlist");
  }

  return response.json();
}
