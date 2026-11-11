import { NextRequest, NextResponse } from "next/server";
import {
  forwardToRouteApi,
  getAccessToken,
  jsonError,
  parseReviewBody,
} from "@/app/_utilites/routeApiProxy";

// GET /api/products/:id/reviews  → public list of a product's reviews
export async function GET(
  req: NextRequest,
  ctx: RouteContext<"/api/products/[id]/reviews">,
) {
  const { id } = await ctx.params;
  const params = new URLSearchParams(req.nextUrl.searchParams);
  if (!params.has("limit")) params.set("limit", "50");
  if (!params.has("sort")) params.set("sort", "-createdAt");

  return forwardToRouteApi(
    `/api/v1/products/${encodeURIComponent(id)}/reviews?${params}`,
    { method: "GET" },
    "Failed to fetch reviews",
  );
}

// POST /api/products/:id/reviews  → create a review (logged-in users)
export async function POST(
  req: NextRequest,
  ctx: RouteContext<"/api/products/[id]/reviews">,
) {
  const token = await getAccessToken(req);
  if (!token) return jsonError("User is not authenticated", 401);

  const body = await parseReviewBody(req);
  if (body instanceof NextResponse) return body;

  const { id } = await ctx.params;
  return forwardToRouteApi(
    `/api/v1/products/${encodeURIComponent(id)}/reviews`,
    { method: "POST", token, body: JSON.stringify(body) },
    "Failed to create review",
  );
}
