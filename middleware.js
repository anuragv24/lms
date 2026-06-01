import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  const sessionToken = request.cookies.get("accessToken")?.value;

  let isTokenValid = false;
  let userPayload = null;

  if (sessionToken) {
    try {
      const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);

      const { payload } = await jwtVerify(sessionToken, secretKey);

      isTokenValid = true;
      userPayload = payload;
    } catch (error) {
      console.error( "Token validation failed :: ", error.message || "Internal server issue");
      isTokenValid = false;
    }
  }

  const isDashboardRoute =
    pathname.startsWith("/books") ||
    pathname.startsWith("/bookmarks") ||
    pathname.startsWith("/reader");
    
  const isAdminRoute =
    pathname.startsWith("/admin") || pathname.startsWith("/admin-upload");
  const isAuthRoute =
    pathname.startsWith("/login") || pathname.startsWith("/register");

  if ((isDashboardRoute || isAdminRoute) && !isTokenValid) {
    const response = NextResponse.redirect(new URL("/login", request.url));

    if (sessionToken) response.cookies.delete("accessToken");
    return response;
  }

  if (isAdminRoute && isTokenValid && userPayload?.role !== "admin") {
    return NextResponse.redirect(new URL("/books", request.url));
  }

  if (isAuthRoute && isTokenValid) {
    const exploreUrl = new URL("/books", request.url);
    return NextResponse.redirect(exploreUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/books/:path*",
    "/bookmarks/:path*",
    "/admin/:path*",
    "/admin-upload/:path*",
    "/reader/:path*",
    "/login",
    "/register",
  ],
};
