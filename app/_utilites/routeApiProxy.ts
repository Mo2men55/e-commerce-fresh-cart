import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { AUTH_SECRET } from "./authSecret";
import { API_BASE_URL } from "@/app/_component/Service/apiConfig";
import type { ReviewInput } from "@/app/types/review";

export async function getAccessToken(req: NextRequest) {
  const token = await getToken({ req, secret: AUTH_SECRET });
  return token?.token as string | undefined;
}

export function jsonError(message: string, status: number) {
  return NextResponse.json({ message, status }, { status });
}

/** Validates a `{ review, rating }` body. Returns the clean input or an error response. */
export async function parseReviewBody(
  req: NextRequest,
): Promise<ReviewInput | NextResponse> {
  const body = await req.json().catch(() => null);
  const review = typeof body?.review === "string" ? body.review.trim() : "";
  const rating = Number(body?.rating);

  if (!review) return jsonError("Review text is required", 400);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return jsonError("Rating must be a whole number between 1 and 5", 400);
  }
  return { review, rating };
}

/** Forwards a request to the Route API and relays its JSON (or a readable error). */
export async function forwardToRouteApi(
  path: string,
  init: RequestInit & { token?: string },
  fallbackError: string,
) {
  const { token, headers, ...rest } = init;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { token } : {}),
      ...headers,
    },
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      payload?.message === "fail" || !payload?.message
        ? payload?.errors?.msg ?? fallbackError
        : payload.message;
    return jsonError(message, response.status);
  }

  return NextResponse.json(payload ?? { message: "success" });
}
