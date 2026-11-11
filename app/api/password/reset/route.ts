import { NextRequest } from "next/server";
import { forwardToRouteApi, jsonError } from "@/app/_utilites/routeApiProxy";

// PUT /api/password/reset  { email, newPassword }  → sets the new password
export async function PUT(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const email = String(body?.email ?? "").trim();
  const newPassword = String(body?.newPassword ?? "");

  if (!email) return jsonError("Email is required", 400);
  if (newPassword.length < 6) {
    return jsonError("Password must be at least 6 characters", 400);
  }

  return forwardToRouteApi(
    "/api/v1/auth/resetPassword",
    { method: "PUT", body: JSON.stringify({ email, newPassword }) },
    "Failed to reset password",
  );
}
