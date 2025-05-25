import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import { NextRequestWithAuth } from "next-auth/middleware"

export default async function middleware(req: NextRequestWithAuth) {
  const token = await getToken({ req })
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin")

  if (isAdminRoute) {
    if (!token) {
      // Redirect to login if not authenticated
      return NextResponse.redirect(new URL("/login", req.url))
    }

    if (token.role !== "admin") {
      // Redirect to home if not admin
      return NextResponse.redirect(new URL("/", req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
} 