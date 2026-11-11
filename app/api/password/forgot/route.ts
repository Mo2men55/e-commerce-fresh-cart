import { NextRequest } from "next/server";
import { forwardToRouteApi, jsonError } from "@/app/_utilites/routeApiProxy";

// POST /api/password/forgot  { email }  → Route API emails a reset code
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const email = String(body?.email ?? "").trim();
  if (!/^\S+@\S+\.\S+$/.test(email)) return jsonError("Enter a valid email", 400);

  return forwardToRouteApi(
    "/api/v1/auth/forgotPasswords",
    { method: "POST", body: JSON.stringify({ email }) },
    "Failed to send reset code",
  );
}
