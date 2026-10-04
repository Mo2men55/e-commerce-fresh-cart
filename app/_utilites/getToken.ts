import { getToken } from "next-auth/jwt";
import { cookies, headers } from "next/headers";
import { AUTH_SECRET } from "./authSecret";

export async function getTokenFun() {
  const cookieStore = await cookies();
  const headerStore = await headers();

  const token = await getToken({
    req: {
      headers: Object.fromEntries(headerStore.entries()),
      cookies: Object.fromEntries(
        cookieStore.getAll().map((cookie) => [cookie.name, cookie.value]),
      ),
    } as Parameters<typeof getToken>[0]["req"],
    secret: AUTH_SECRET,
  });

  return token?.token as string | undefined;
}
