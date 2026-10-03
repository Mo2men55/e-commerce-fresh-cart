

import { getTokenFun } from "@/app/_utilites/getToken";

export async function getcart() {
  const token = await getTokenFun();
  if (!token) {
    throw new Error("User is not authenticated");
  }
  try {
    const response = await fetch(
      `https://ecommerce.routemisr.com/api/v2/cart`,
      {method: "GET",
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
    return payload;
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error("Failed to fetch cart");
  }
}
