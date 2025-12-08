import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const LOGIN = "/login";
const CART = "/cart";
const PRODUCT = "/product";
const SHOP = "/shop";

export async function middleware(req: NextRequest) {
  const { pathname, origin, search } = req.nextUrl;

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isAuthenticated = Boolean(token);
  const role = token?.role;

  if (pathname.startsWith(LOGIN) && isAuthenticated) {
    return NextResponse.redirect(new URL(SHOP, origin));
  }

  if (pathname.startsWith(CART) && !isAuthenticated) {
    const loginUrl = new URL(LOGIN, origin);
    loginUrl.searchParams.set("callbackUrl", pathname + search);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith(PRODUCT)) {
    if (!isAuthenticated) {
      const loginUrl = new URL(LOGIN, origin);
      loginUrl.searchParams.set("callbackUrl", pathname + search);
      return NextResponse.redirect(loginUrl);
    }
    if (role !== "admin") {
      return NextResponse.redirect(new URL(SHOP, origin));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/cart/:path*", "/product/:path*"],
};
