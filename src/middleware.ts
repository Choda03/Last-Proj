import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import { NextRequestWithAuth } from "next-auth/middleware"

export default async function middleware(req: NextRequestWithAuth) {
  try {
    console.log("MIDDLEWARE COOKIES:", req.cookies);
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET, // <-- Explicitly pass the secret
    });
    console.log("MIDDLEWARE TOKEN:", token);
    const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");

    if (isAdminRoute) {
      if (!token) {
        console.warn("[middleware] No token found, redirecting to /login");
        return NextResponse.redirect(new URL("/login", req.url));
      }
      if (token.role !== "admin") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    return NextResponse.next();
  } catch (err) {
    console.error("[middleware] Error extracting token:", err);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/admin/:path*"],
}