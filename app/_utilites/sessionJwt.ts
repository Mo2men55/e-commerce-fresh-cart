import { getToken, type JWT } from "next-auth/jwt";
import { AUTH_SECRET } from "./authSecret";

type TokenRequest = Parameters<typeof getToken>[0]["req"];

const SECURE_SESSION_COOKIE = "__Secure-next-auth.session-token";

function cookieNames(req: TokenRequest): string[] {
  const cookies: unknown = req.cookies;
  if (!cookies) return [];
  if (typeof (cookies as { getAll?: unknown }).getAll === "function") {
    return (cookies as { getAll: () => { name: string }[] }).getAll().map((c) => c.name);
  }
  return Object.keys(cookies as Record<string, string>);
}

/**
 * Reads the next-auth JWT from the request.
 *
 * next-auth names the session cookie `__Secure-next-auth.session-token` on HTTPS
 * and `next-auth.session-token` on HTTP. By default `getToken()` guesses which one
 * from `NEXTAUTH_URL`, so a wrong/localhost `NEXTAUTH_URL` on Vercel makes it look
 * for the wrong cookie and every request seems logged out. Here we pick the name
 * from the cookies the browser actually sent (including chunked `.0`, `.1` cookies).
 */
export async function readSessionJwt(req: TokenRequest): Promise<JWT | null> {
  const secureCookie = cookieNames(req).some(
    (name) =>
      name === SECURE_SESSION_COOKIE || name.startsWith(`${SECURE_SESSION_COOKIE}.`),
  );
  return getToken({ req, secret: AUTH_SECRET, secureCookie });
}

/** The Route API access token stored inside the next-auth JWT. */
export async function readAccessToken(req: TokenRequest): Promise<string | undefined> {
  const jwt = await readSessionJwt(req);
  return (jwt?.token as string | undefined) ?? undefined;
}
