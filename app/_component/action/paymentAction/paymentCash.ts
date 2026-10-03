"use server";

import { getTokenFun } from "@/app/_utilites/getToken";

export async function paymentCash(
  cartId: string,
  shippingAddress: ShippingAddress,
) {
  const token = await getTokenFun();
  if (!token) {
    throw new Error("User is not authenticated");
  }

  try {
    const response = await fetch(
      `https://ecommerce.routemisr.com/api/v2/orders/${cartId}`,
      {
        method: "POST",
        body: JSON.stringify({ shippingAddress }),
        headers: {
          token,
          "Content-Type": "application/json",
        },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to place cash order");
    }

    return data;
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error("Failed to place cash order");
  }
}

export async function paymentOnline(
  cartId: string,
  shippingAddress: ShippingAddress,
) {
  const token = await getTokenFun();
  if (!token) {
    throw new Error("User is not authenticated");
  }

  try {
    const response = await fetch(
      `https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${cartId}?url=${process.env.NEXTAUTH_URL}`,
      {
        method: "POST",
        body: JSON.stringify({ shippingAddress }),
        headers: {
          token,
          "Content-Type": "application/json",
        },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to create checkout session");
    }

    return data;
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error("Failed to create checkout session");
  }
}

export interface ShippingAddress {
  details: string;
  phone: string;
  city: string;
  postalCode: string;
}
