import { getServerSession } from "next-auth";
import { authOption } from "@/app/next-auth/authOptions";

export async function getTokenFun() {
  const session = await getServerSession(authOption);
  return session?.user?.token;
}
