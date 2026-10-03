import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    return NextResponse.json(
      { message: "User is not authenticated", status: 401 },
      { status: 401 },
    );
  }

  const response = await fetch(
    `https://ecommerce.routemisr.com/api/v1/wishlist`,
    {
      headers: {
        token: token?.token as string,
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    return NextResponse.json(
      { message: "Failed to fetch wishlist", status: response.status },
      { status: response.status },
    );
  }

  const payload = await response.json();
  return NextResponse.json(payload);
}
