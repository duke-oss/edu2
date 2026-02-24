import { auth } from "@/auth";
import { NextResponse } from "next/server";

// Routes that require authentication
const protectedPaths = ["/courses", "/dashboard", "/inquiry"];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));

  if (isProtected && !req.auth) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
