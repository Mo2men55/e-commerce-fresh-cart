import type { getToken } from "next-auth/jwt";
import { cookies, headers } from "next/headers";
import { readAccessToken } from "./sessionJwt";

export async function getTokenFun() {
  const cookieStore = await cookies();
  const headerStore = await headers();

  return readAccessToken({
      headers: Object.fromEntries(headerStore.entries()),
      cookies: Object.fromEntries(
        cookieStore.getAll().map((cookie) => [cookie.name, cookie.value]),
      ),
    } as Parameters<typeof getToken>[0]["req"]);
}
