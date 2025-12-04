// proxy.ts
import { getToken } from "next-auth/jwt";
import { NextRequest, ProxyConfig } from "next/server";

export const config: ProxyConfig = {
  matcher: [
    "/auth/:path*",
    "/institute/:path*",
    "/user/:path*",
    "/student/:path*",
    "/teacher/:path*",
    "/dashboard/:path*",
  ],
};

// NEW PROXY HANDLER (replaces middleware)
const handler = async (request: NextRequest) => {
  const token = await getToken({ req: request });
  const url = new URL(request.url);
  const pathname = url.pathname;

  const isLoggedIn = !!token;

  // ==========================
  // PUBLIC ROUTES
  // ==========================
  const isAuthRoute = pathname.startsWith("/auth");

  const exactPublicRoutes = [
    "/",
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
    return Response.redirect(new URL("/", request.url));
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
    return Response.redirect(new URL("/institute/dashboard", request.url));
  }

  if (
    role === "student" &&
    (pathname.startsWith("/institute") ||
      pathname.startsWith("/teacher") ||
      pathname.startsWith("/user"))
  ) {
    return Response.redirect(new URL("/student/dashboard", request.url));
  }

  if (
    role === "teacher" &&
    (pathname.startsWith("/institute") ||
      pathname.startsWith("/student") ||
      pathname.startsWith("/user"))
  ) {
    return Response.redirect(new URL("/teacher/dashboard", request.url));
  }

  if (
    role === "user" &&
    (pathname.startsWith("/institute") ||
      pathname.startsWith("/student") ||
      pathname.startsWith("/teacher"))
  ) {
    return Response.redirect(new URL("/user/dashboard", request.url));
  }

  // Allow request to continue
  return;
};

// MUST EXPORT DEFAULT IN PROXY API
export default handler;
