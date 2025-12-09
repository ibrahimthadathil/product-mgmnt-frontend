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
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.name = token.name;
        session.user.email = token.email as string;
        session.user.role = token.role;
        (session.user as any).token = token.accessToken as string;
      }
      return session;
    },




        async redirect({ url, baseUrl }) {
      const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || baseUrl;
          console.log('url :- ',url);
          

      // Handle signout
      if (url.includes('/api/auth/signout')) {
        return `${frontendUrl}/login`;
      }

      // Handle signin success
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

      // Default fallback
      return frontendUrl;
    },



  },
  pages: {
    signIn: "/login"
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours - how often session is updated
  },
  
  // secret: process.env.NEXTAUTH_SECRET,
  secret: process.env.NEXTAUTH_SECRET,
  cookies: {
    // Add custom cookie configuration
    sessionToken: {
      name: `product-session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        // secure: process.env.NODE_ENV === "production",
      },
    },
    callbackUrl: {
      name: `product-callback-url`,
      options: {
        sameSite: "lax",
        path: "/",
        // secure: process.env.NODE_ENV === "production",
      },
    },
    csrfToken: {
      name: `product-csrf-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        // secure: process.env.NODE_ENV === "production",
      },
    },
    
  
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };








// import { AuthOptions } from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";

// export const authConfig: AuthOptions = {
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "email", placeholder: "your@email.com" },
//         token: { label: "Token", type: "token" },
//         verified: { label: "Verified", type: "boolean" },
//         otpAccess: { label: "OTP Access", type: "boolean" },
//         conformPasswordAccess: { label: "Conform Password Access", type: "boolean" },
//         country: { label: "Country", type: "string" },
//         city: { label: "City", type: "string" },
//         name: { label: "Name", type: "string" },
//         id: { label: "ID", type: "string" },
//       },
//       async authorize(credentials,) {


//         if (!credentials?.email) {
//           console.log("Email is required.");
//           return null;
//         }

//         // Mock user for now, replace with actual DB call
//         const user = {
//           id: credentials.id as string || "123",
//           name: credentials.name as string || "",
//           email: credentials.email as string,
//           token: credentials.token as string,
//           verified: credentials.verified as unknown as boolean,
//           otpAccess: credentials.otpAccess as unknown as boolean,
//           conformPasswordAccess: credentials.conformPasswordAccess as unknown as boolean,
//           country: credentials.country as string,
//           city: credentials.city as string,

//         };



//         return user;
//       }
//     }),
//   ],

//   pages: {
//     signIn: "/login"
//   },

//   session: {
//     strategy: "jwt",
//     maxAge: 30 * 24 * 60 * 60, // 30 days
//     updateAge: 24 * 60 * 60, // 24 hours - how often session is updated
//   },
//   cookies: {
//     // Add custom cookie configuration
//     sessionToken: {
//       name: `client-mt5-session-token`,
//       options: {
//         httpOnly: true,
//         sameSite: "lax",
//         path: "/",
//         // secure: process.env.NODE_ENV === "production",
//       },
//     },
//     callbackUrl: {
//       name: `client-mt5-callback-url`,
//       options: {
//         sameSite: "lax",
//         path: "/",
//         // secure: process.env.NODE_ENV === "production",
//       },
//     },
//     csrfToken: {
//       name: `client-mt5-csrf-token`,
//       options: {
//         httpOnly: true,
//         sameSite: "lax",
//         path: "/",
//         // secure: process.env.NODE_ENV === "production",
//       },
//     },
//   },
//   callbacks: {
//     async jwt({ token, user, trigger, account, profile, session }) {

//       if (trigger === "update") {
//         token.name = session?.name || token?.name;
//         token.id = session?.id || token?.id;
//         token.email = session?.email || token?.email;
//         token.token = session?.token || token?.token;
//         token.image = session?.image || token?.image;
//         token.verified = session?.verified || token?.verified;
//         token.otpAccess = session?.otpAccess || token?.otpAccess;
//         token.conformPasswordAccess = session?.conformPasswordAccess || token?.conformPasswordAccess;
//       }
//       // When user signs in, store user data in token
//       if (user) {
//         token.id = user?.id;
//         token.name = user?.name;
//         token.email = user?.email;
//         token.token = user.token;
//         token.image = user?.image || "";
//         token.verified = user?.verified;
//         token.otpAccess = user?.otpAccess;
//         token.conformPasswordAccess = user?.conformPasswordAccess;
//         token.country = user?.country;
//         token.city = user?.city;
//       }

//       return token;
//     },

//     async session({ session, token }) {


//       // Send properties to the client
//       if (token && session.user) {
//         session.user.id = token.id as string;
//         session.user.name = token.name as string;
//         session.user.email = token.email as string;
//         session.user.token = token.token as string;
//       }

//       return session;
//     },

//     async redirect({ url, baseUrl }) {
//       const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || baseUrl;



//       // Handle signout
//       if (url.includes('/api/auth/signout')) {
//         return `${frontendUrl}/auth/login`;
//       }

//       // Handle signin success
//       if (url.includes('/api/auth/signin') || url === '/auth/login') {
//         return frontendUrl;
//       }

//       // Allow relative URLs
//       if (url.startsWith('/')) {
//         return `${frontendUrl}${url}`;
//       }

//       // Allow same-origin URLs
//       if (url.startsWith(frontendUrl)) {
//         return url;
//       }

//       // Default fallback
//       return frontendUrl;
//     },
//   },

//   // Add these additional options for stability
//   debug: process.env.NODE_ENV === 'development',
//   secret: process.env.NEXTAUTH_SECRET,

//   // JWT options for better token handling
//   jwt: {
//     maxAge: 30 * 24 * 60 * 60, // 30 days
//   },

//   // Events for debugging
//   events: {
//     async signIn({ user, account, profile }) {

//     },
//     async signOut({ session, token }) {

//     },
//     async session({ session, token }) {

//     },
//   },
// };

// // Type declarations
// declare module "next-auth" {
//   interface Session {
//     user: {
//       id: string;
//       name: string;
//       email: string;
//       token?: string;
//       image?: string;
//       verified?: boolean;
//       otpAccess?: boolean;
//       conformPasswordAccess?: boolean;
//       country?: string;
//       city?: string;
//     };
//   }

//   interface User {
//     id: string;
//     name: string;
//     email: string;
//     token?: string;
//     image?: string;
//     verified?: boolean;
//     otpAccess?: boolean;
//     conformPasswordAccess?: boolean;
//     country?: string;
//     city?: string;
//   }
// }

// declare module "next-auth/jwt" {
//   interface JWT {
//     id: string;
//     name: string;
//     email: string;
//     token?: string;
//     image?: string;
//     verified?: boolean;
//     otpAccess?: boolean;
//     conformPasswordAccess?: boolean;
//     country?: string;
//     city?: string;
//   }
// }