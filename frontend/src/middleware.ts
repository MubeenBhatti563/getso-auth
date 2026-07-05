import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicRoutes = [
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
];

const adminRoutes = ["/admin"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublic = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "?"),
  );

  const isAdmin = adminRoutes.some((route) => pathname.startsWith(route));

  const refreshToken = request.cookies.get("refreshToken");
  const userRole = request.cookies.get("userRole")?.value;

  // not logged in + protected route → login
  if (!isPublic && !refreshToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // logged in + auth pages → dashboard
  if (isPublic && refreshToken && pathname !== "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // logged in + admin route + not admin → dashboard
  if (isAdmin && refreshToken && userRole !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
