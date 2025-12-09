import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        name: { label: "Name", type: "text" },
        role: { label: "Role", type: "text" },
        token: { label: "Token", type: "text" },
        password: { label: "Password", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.name) {
          return null;
        }

        const user: any = {
          id: credentials.email, // Add an ID field
          name: credentials.name,
          email: credentials.email as string,
          role: credentials.role,
          token: credentials.token as string,
          password: credentials.password as string,
        };

        if (user) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as any).token;
        token.name = user.name;
        token.role = (user as any).role;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        (session.user as any).role = token.role;
        (session.user as any).token = token.accessToken as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || baseUrl;
      console.log('Redirect - url:', url, 'baseUrl:', baseUrl, 'frontendUrl:', frontendUrl);

      // Handle signout
      if (url.includes('/api/auth/signout')) {
        return `${frontendUrl}/login`;
      }

      // Handle callback after successful signin
      if (url.includes('/api/auth/callback/credentials')) {
        return frontendUrl;
      }

      // Handle signin page
      if (url.includes('/api/auth/signin') || url === '/login') {
        return frontendUrl;
      }

      // Allow relative URLs
      if (url.startsWith('/')) {
        return `${frontendUrl}${url}`;
      }

      // Allow same-origin URLs
      if (url.startsWith(frontendUrl)) {
        return url;
      }

      // Prevent open redirect vulnerabilities
      if (url.startsWith(baseUrl)) {
        return url;
      }

      // Default fallback
      return frontendUrl;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login", // Redirect errors to login page
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
  cookies: {
    sessionToken: {
      name: `product-session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    callbackUrl: {
      name: `product-callback-url`,
      options: {
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    csrfToken: {
      name: `product-csrf-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };