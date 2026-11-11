import { NextRequest, NextResponse } from "next/server";
import {
  forwardToRouteApi,
  getAccessToken,
  jsonError,
  parseReviewBody,
} from "@/app/_utilites/routeApiProxy";

// GET /api/reviews/:id  → single review
export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/reviews/[id]">,
) {
  const { id } = await ctx.params;
  return forwardToRouteApi(
    `/api/v1/reviews/${encodeURIComponent(id)}`,
    { method: "GET" },
    "Failed to fetch review",
  );
}

// PUT /api/reviews/:id  → update (owner only)
export async function PUT(
  req: NextRequest,
  ctx: RouteContext<"/api/reviews/[id]">,
) {
  const token = await getAccessToken(req);
  if (!token) return jsonError("User is not authenticated", 401);

  const body = await parseReviewBody(req);
  if (body instanceof NextResponse) return body;

  const { id } = await ctx.params;
  return forwardToRouteApi(
    `/api/v1/reviews/${encodeURIComponent(id)}`,
    { method: "PUT", token, body: JSON.stringify(body) },
    "Failed to update review",
  );
}

// DELETE /api/reviews/:id  → delete (owner / admin)
export async function DELETE(
  req: NextRequest,
  ctx: RouteContext<"/api/reviews/[id]">,
) {
  const token = await getAccessToken(req);
  if (!token) return jsonError("User is not authenticated", 401);

  const { id } = await ctx.params;
  return forwardToRouteApi(
    `/api/v1/reviews/${encodeURIComponent(id)}`,
    { method: "DELETE", token },
    "Failed to delete review",
  );
}
