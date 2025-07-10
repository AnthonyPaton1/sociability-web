import type { NextAuthConfig } from "next-auth";
import { NextResponse } from "next/server";

export const authConfig = {
  providers: [],

  callbacks: {
    authorized({ request, auth }: any) {
      const { pathname } = request.nextUrl;

      console.log("AUTHORIZED middleware: user =", auth?.user);

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

      const isProtected = protectedPaths.some((p) => p.test(pathname));

      // If accessing a protected route and not authenticated
      if (isProtected && !auth?.user) return false;

      // Restrict /admin routes to admins only
      if (
        pathname.startsWith("/admin") &&
        auth?.user?.email !== "admin@testtest.com"
      ) {
        return false;
      }

      // Restrict /vendor routes to vendors and admins
      if (
        pathname.startsWith("/vendors") &&
        !["admin@testtest.com", "vendor1@example.com"].includes(
          auth?.user?.email
        )
      ) {
        return false;
      }

      // Generate sessionCartId if missing
      if (!request.cookies.get("sessionCartId")) {
        const sessionCartId = crypto.randomUUID();
        const response = NextResponse.next({
          request: {
            headers: new Headers(request.headers),
          },
        });

        response.cookies.set("sessionCartId", sessionCartId);
        return response;
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
