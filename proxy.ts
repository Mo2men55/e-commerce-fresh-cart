import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const pathProtected = [
  "/cart",
  "/checkout",
  "/profile",
  "/orders",
  "/allorders",
  "/wishlist",
  "/address",
];

const pathUnprotected = ["/login", "/signup", "/forgetpass"];

export async function proxy(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });
  const isAuthenticated = Boolean(token);
  const pathname = req.nextUrl.pathname.toLowerCase();

  if (
    pathProtected.some((path) => pathname.startsWith(path)) &&
    !isAuthenticated
  ) {
    const url = req.nextUrl.clone();
    url.pathname = "/LogIn";
    return NextResponse.redirect(url);
  }

  if (
    pathUnprotected.some((path) => pathname.startsWith(path)) &&
    isAuthenticated
  ) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/cart/:path*",
    "/checkout/:path*",
    "/profile/:path*",
    "/orders/:path*",
    "/allorders/:path*",
    "/wishlist/:path*",
    "/address/:path*",
    "/LogIn",
    "/SignUp",
    "/forgetPass",
  ],
};
