import { NextRequest } from "next/server";
import { forwardToRouteApi, jsonError } from "@/app/_utilites/routeApiProxy";

// POST /api/password/verify  { resetCode }  → checks the emailed code
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const resetCode = String(body?.resetCode ?? "").trim();
  if (!/^\d{4,6}$/.test(resetCode)) {
    return jsonError("Enter the code from your email", 400);
  }

  return forwardToRouteApi(
    "/api/v1/auth/verifyResetCode",
    { method: "POST", body: JSON.stringify({ resetCode }) },
    "Invalid or expired reset code",
  );
}
