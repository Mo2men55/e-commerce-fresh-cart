export const AUTH_SECRET =
  process.env.NEXTAUTH_SECRET ??
  process.env.AUTH_SECRET ??
  "dev-secret-change-me";
