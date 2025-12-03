// middleware.ts
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  const isLoggedIn = !!token;

  // ==========================
  // PUBLIC ROUTES
  // ==========================
  const isAuthRoute = pathname.startsWith("/auth");

  const exactPublicRoutes = [
    "/", // homepage only
    "/institute-login",
    "/institute-register",
    "/forgot-password",
  ];

  const isExactPublic = exactPublicRoutes.includes(pathname);

  const isPublic = isAuthRoute || isExactPublic;

  // ==========================
  // 1) Not logged in → block protected
  // ==========================
  if (!isLoggedIn && !isPublic) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  // ==========================
  // 3) ROLE BASED PROTECTION
  // ==========================
  const role = token?.role;

  if (
    role === "institute" &&
    (pathname.startsWith("/student") ||
      pathname.startsWith("/teacher") ||
      pathname.startsWith("/user"))
  ) {
    return NextResponse.redirect(new URL("/institute/dashboard", request.url));
  }

  if (
    role === "student" &&
    (pathname.startsWith("/institute") ||
      pathname.startsWith("/teacher") ||
      pathname.startsWith("/user"))
  ) {
    return NextResponse.redirect(new URL("/student/dashboard", request.url));
  }

  if (
    role === "teacher" &&
    (pathname.startsWith("/institute") ||
      pathname.startsWith("/student") ||
      pathname.startsWith("/user"))
  ) {
    return NextResponse.redirect(new URL("/teacher/dashboard", request.url));
  }
  if (
    role === "user" &&
    (pathname.startsWith("/institute") ||
      pathname.startsWith("/student") ||
      pathname.startsWith("/teacher"))
  ) {
    return NextResponse.redirect(new URL("/user/dashboard", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/auth/:path*",
    "/institute/:path*",
    "/user/:path*",
    "/student/:path*",
    "/teacher/:path*",
    "/dashboard/:path*",
  ],
};
