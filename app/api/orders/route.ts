import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";
import { AUTH_SECRET } from "@/app/_utilites/authSecret";

export async function GET(req: NextRequest) {
  const token = await getToken({
    req,
    secret: AUTH_SECRET,
  });

  if (!token?.token) {
    return NextResponse.json(
      { message: "User is not authenticated" },
      { status: 401 },
    );
  }

  const decoded = jwtDecode<{ id: string }>(token.token as string);
  const userId = decoded.id || (token.id as string);

  if (!userId) {
    return NextResponse.json(
      { message: "User id not found" },
      { status: 400 },
    );
  }

  const response = await fetch(
    `https://ecommerce.routemisr.com/api/v1/orders/user/${userId}`,
    {
      headers: {
        token: token.token as string,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    return NextResponse.json(
      { message: "Failed to fetch orders" },
      { status: response.status },
    );
  }

  const payload = await response.json();
  const orders = Array.isArray(payload) ? payload : (payload.data ?? []);

  return NextResponse.json({ data: orders });
}
