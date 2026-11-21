import { NextRequest, NextResponse } from "next/server";


const protectedRoutes = [
  "/dashboard",
  "/profile",
  "/connections",
  "/messages",
  "/notifications",
  "/settings",
  "/network"
];

const authRoutes = [
  "/auth/login",
  "/auth/register"
];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = req.cookies.get("token")?.value;
  const isAuthenticated = !!token;

  console.log("Proxy running:", pathname);

  const isProtectedRoute = protectedRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(`${route}/`));

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  if (!isAuthenticated) {
    const loginUrl = new URL("/auth/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);

  }


  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/connections/:path*",
    "/messages/:path*",
    "/notifications/:path*",
    "/settings/:path*",
    "/network/:path*",
  ],
};
