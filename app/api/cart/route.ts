import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = await getToken({
    req: req,
    secret: process.env.NEXTAUTH_SECRET,
  });
 
  if (!token) {
    return NextResponse.json({
      message: "User is not authenticated",
      status: 401,
    });
  }

  const response = await fetch(`https://ecommerce.routemisr.com/api/v2/cart`, {
    headers: {
      token: token?.token as string,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
   return NextResponse.json({
      message: "User is not authenticated",
      status: 401,
    });
  }
  const payload = await response.json();

  return NextResponse.json( payload);
}
