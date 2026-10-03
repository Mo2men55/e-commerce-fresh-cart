"use server";

import { getTokenFun } from "@/app/_utilites/getToken";
  
export async function paymentCash(cartId: string ,shippingAddress: ShippingAddress) {
  const token = await getTokenFun();
  if (!token) {
    throw new Error("User is not authenticated");
  }
  console.log("Cart ID:", cartId);
  try {
    const response = await fetch(
      `https://ecommerce.routemisr.com/api/v2/orders/${cartId}`,
      {
        method: "POST",
        body: JSON.stringify({shippingAddress: shippingAddress}),
        headers: {
          token: token,
          "Content-Type": "application/json",
        },
      },
    );
    
    const data = await response.json(); 
    
  
    console.log("API Response Body:", data);
    console.log("Response:",response);
    if (!response.ok) {
      throw new Error("Failed to add product to cart");
    }
    
    return data;
  } catch (error) {
    console.error("Error adding product to cart:", error);
  }
}
export async function paymentOnline(cartId: string ,shippingAddress: ShippingAddress) {
  const token = await getTokenFun();
  if (!token) {
    throw new Error("User is not authenticated");
  }
  console.log("Cart ID:", cartId);
  try {
    const response = await fetch(
      `https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${cartId}?url=${process.env.NEXTAUTH_URL}`,
      {
        method: "POST",
        body: JSON.stringify({shippingAddress: shippingAddress}),
        headers: {
          token: token,
          "Content-Type": "application/json",
        },
      },
    );
    
    const data = await response.json(); 
    
  
    console.log("API Response Body:", data);
    console.log("Response:",response);
    if (!response.ok) {
      throw new Error("Failed to add product to cart");
    }
    
    return data;
  } catch (error) {
    console.error("Error adding product to cart:", error);
  }
}
export interface ShippingAddress {
  details: string;
  phone: string;
  city: string;
  postalCode: string;
}