import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { AUTH_SECRET } from "@/app/_utilites/authSecret";
import { API_BASE_URL } from "@/app/_component/Service/apiConfig";

async function getAccessToken(req: NextRequest) {
  const token = await getToken({
    req,
    secret: AUTH_SECRET,
  });
  return token?.token as string | undefined;
}

export async function GET(req: NextRequest) {
  const accessToken = await getAccessToken(req);

  if (!accessToken) {
    return NextResponse.json(
      { message: "User is not authenticated", status: 401 },
      { status: 401 },
    );
  }

  const response = await fetch(`${API_BASE_URL}/api/v2/cart`, {
    headers: {
      token: accessToken,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    return NextResponse.json(
      { message: "Failed to fetch cart", status: response.status },
      { status: response.status },
    );
  }

  const payload = await response.json();
  return NextResponse.json(payload);
}

export async function POST(req: NextRequest) {
  const accessToken = await getAccessToken(req);

  if (!accessToken) {
    return NextResponse.json(
      { message: "User is not authenticated", status: 401 },
      { status: 401 },
    );
  }

  const body = await req.json();
  const productId = body?.productId;

  if (!productId || typeof productId !== "string") {
    return NextResponse.json(
      { message: "productId is required", status: 400 },
      { status: 400 },
    );
  }

  const response = await fetch(`${API_BASE_URL}/api/v2/cart`, {
    method: "POST",
    body: JSON.stringify({ productId }),
    headers: {
      token: accessToken,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    return NextResponse.json(
      { message: "Failed to add product to cart", status: response.status },
      { status: response.status },
    );
  }

  const payload = await response.json();
  return NextResponse.json(payload);
}
