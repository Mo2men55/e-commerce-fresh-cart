"use server";

import { getTokenFun } from "@/app/_utilites/getToken";

export async function updateCartCount(productId: string, count: number) {
  const token = await getTokenFun();
  if (!token) {
    throw new Error("User is not authenticated");
  }

  const response = await fetch(
    `https://ecommerce.routemisr.com/api/v1/cart/${productId}`,
    {
      method: "PUT",
      body: JSON.stringify({ count }),
      headers: {
        token,
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to update cart");
  }

  return response.json();
}

export async function removeCartItem(productId: string) {
  const token = await getTokenFun();
  if (!token) {
    throw new Error("User is not authenticated");
  }

  const response = await fetch(
    `https://ecommerce.routemisr.com/api/v1/cart/${productId}`,
    {
      method: "DELETE",
      headers: {
        token,
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to remove item");
  }

  return response.json();
}

export async function clearCart() {
  const token = await getTokenFun();
  if (!token) {
    throw new Error("User is not authenticated");
  }

  const response = await fetch(`https://ecommerce.routemisr.com/api/v1/cart`, {
    method: "DELETE",
    headers: {
      token,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to clear cart");
  }

  return response.json();
}
