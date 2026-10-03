import { NextAuthOptions, Session, User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { jwtDecode } from "jwt-decode";
import { JWT } from "next-auth/jwt";
import { API_BASE_URL } from "../_component/Service/apiConfig";

export const authOption: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      name: "my-login",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "Enter your email",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your password",
        },
      },
      async authorize(credentials) {
        const response = await fetch(
          `${API_BASE_URL}/api/v1/auth/signin`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          },
        );
        const data = await response.json();

        if (!response.ok || !data.token) {
          throw new Error(data.message || "Invalid email or password");
        }

        const userData: { id: string } = jwtDecode(data.token);

        return {
          id: userData.id,
          email: data.user.email,
          name: data.user.name,
          token: data.token,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.token = user.token;
      }
      return token;
    },
  async session({ session, token }) {
    if (token) {
      session.user.id = token.id as string;
      session.user.email = token.email as string;
      session.user.name = token.name as string;
      session.user.token = token.token as string;
    }
    return session;
  },
  },
  pages: {
    signIn: "/LogIn",
  },
};
