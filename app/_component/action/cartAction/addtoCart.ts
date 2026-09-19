"use server";

import { getTokenFun } from "@/app/_utilites/getToken";

export async function addToCart(productId: string) {
  const token = await getTokenFun();
  if (!token) {
    throw new Error("User is not authenticated");
  }
  try {
    const response = await fetch(
      `https://ecommerce.routemisr.com/api/v2/cart`,
      {
        method: "POST",
        body: JSON.stringify({ productId: productId }),
        headers: {
          token: token,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to add product to cart");
    }
    const payload = await response.json();
    console.log(payload);
    return payload;
  } catch (error) {
    console.error("Error adding product to cart:", error);
  }
}
