import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        try {
          const response = await axios.post(
            `${API_URL}/api/auth/signin`,
            {
              email: credentials.email,
              password: credentials.password,
            },
            {
              withCredentials: true,
            }
          );

          const { success, accessToken, message, userName } = response.data;

          if (!success || !accessToken) {
            throw new Error(message || "Authentication failed");
          }

          const tokenPayload = JSON.parse(
            Buffer.from(accessToken.split(".")[1], "base64").toString()
          );

          return {
            id: tokenPayload.id,
            email: tokenPayload.email,
            name:
              userName ||
              tokenPayload.name ||
              "",
            role: tokenPayload.role || "user",
            accessToken,
          };
        } catch (error: any) {
          console.error("Auth error:", error);
          throw new Error(
            error.response?.data?.message || "Invalid credentials"
          );
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.id = user.id;
        token.name = user.name;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id as string,
          email: token.email as string,
          name: token.name as string,
          role: token.role as string,
        };
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
