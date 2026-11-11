import { NextRequest } from "next/server";
import {
  forwardToRouteApi,
  getAccessToken,
  jsonError,
} from "@/app/_utilites/routeApiProxy";

// GET /api/addresses/:id  → one saved address
export async function GET(
  req: NextRequest,
  ctx: RouteContext<"/api/addresses/[id]">,
) {
  const token = await getAccessToken(req);
  if (!token) return jsonError("User is not authenticated", 401);

  const { id } = await ctx.params;
  return forwardToRouteApi(
    `/api/v1/addresses/${encodeURIComponent(id)}`,
    { method: "GET", token },
    "Failed to fetch address",
  );
}

// DELETE /api/addresses/:id  → remove a saved address
export async function DELETE(
  req: NextRequest,
  ctx: RouteContext<"/api/addresses/[id]">,
) {
  const token = await getAccessToken(req);
  if (!token) return jsonError("User is not authenticated", 401);

  const { id } = await ctx.params;
  return forwardToRouteApi(
    `/api/v1/addresses/${encodeURIComponent(id)}`,
    { method: "DELETE", token },
    "Failed to remove address",
  );
}
