import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = request.nextUrl;

  const protectedPaths = [
    /^\/shipping-address/,
    /^\/payment-method/,
    /^\/place-order/,
    /^\/profile/,
    /^\/user\/.*/,
    /^\/order\/.*/,
    /^\/admin/,
    /^\/vendors/,
  ];

  if (protectedPaths.some((p) => p.test(pathname)) && !token?.role) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (pathname.startsWith("/admin") && token?.role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  if (
    pathname.startsWith("/vendors") &&
    !["vendor", "admin"].includes(token?.role ?? "")
  ) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  if (!request.cookies.get("sessionCartId")) {
    const sessionCartId = crypto.randomUUID();
    const response = NextResponse.next();
    response.cookies.set("sessionCartId", sessionCartId);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/shipping-address",
    "/payment-method",
    "/place-order",
    "/profile",
    "/user/:path*",
    "/order/:path*",
    "/admin/:path*",
    "/vendors/:path*",
  ],
};
