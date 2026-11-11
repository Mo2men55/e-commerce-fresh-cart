import { NextRequest } from "next/server";
import {
  forwardToRouteApi,
  getAccessToken,
  jsonError,
} from "@/app/_utilites/routeApiProxy";

const EGYPT_PHONE = /^01[0125][0-9]{8}$/;

// GET /api/addresses  → logged-in user's saved addresses
export async function GET(req: NextRequest) {
  const token = await getAccessToken(req);
  if (!token) return jsonError("User is not authenticated", 401);

  return forwardToRouteApi(
    "/api/v1/addresses",
    { method: "GET", token },
    "Failed to fetch addresses",
  );
}

// POST /api/addresses  → add an address { name, details, phone, city }
export async function POST(req: NextRequest) {
  const token = await getAccessToken(req);
  if (!token) return jsonError("User is not authenticated", 401);

  const body = await req.json().catch(() => null);
  const input = {
    name: String(body?.name ?? "").trim(),
    details: String(body?.details ?? "").trim(),
    phone: String(body?.phone ?? "").trim(),
    city: String(body?.city ?? "").trim(),
  };

  if (!input.name || !input.details || !input.city) {
    return jsonError("Name, details and city are required", 400);
  }
  if (!EGYPT_PHONE.test(input.phone)) {
    return jsonError("Enter a valid Egyptian phone number (e.g. 01012345678)", 400);
  }

  return forwardToRouteApi(
    "/api/v1/addresses",
    { method: "POST", token, body: JSON.stringify(input) },
    "Failed to add address",
  );
}
