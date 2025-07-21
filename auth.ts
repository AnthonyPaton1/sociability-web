import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { compareSync } from "bcrypt-ts-edge";
import { prismaAuth } from "./lib/db/prisma-auth";
import { cookies } from "next/headers";
import type { User as PrismaUser } from "@prisma/client";
import type { NextAuthOptions } from "next-auth";
import type { Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },

  adapter: PrismaAdapter(prismaAuth),

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "you@example.com" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "••••••••",
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const email = credentials.email as string;
        const password = credentials.password as string;

        const user = await prismaAuth.user.findFirst({
          where: { email },
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
            password: true,
            vendorId: true,
            Vendor: {
              select: {
                businessName: true,
              },
            },
          },
        });

        if (user?.password && compareSync(password, user.password)) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            role: user.role,
            vendorId: user.vendorId ?? undefined,
            businessName: user.Vendor?.businessName ?? undefined,
            type: "credentials",
          };
        }

        return null;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        const safeUser = user as PrismaUser & {
          vendorId?: string;
          businessName?: string;
        };

        token.id = safeUser.id;
        token.role = safeUser.role === "vendors" ? "vendor" : safeUser.role;

        token.name = safeUser.name ?? safeUser.email?.split("@")[0];
        token.vendorId = safeUser.vendorId;
        token.businessName = safeUser.businessName;
      }

      return token;
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      session.user.id = token.id as string;
      session.user.role = token.role as string;
      session.user.name = token.name;
      session.user.vendorId = token.vendorId as string | undefined;
      session.user.businessName = token.businessName as string | undefined;

      return session;
    },

    async signIn({ user }: { user: User }) {
      try {
        const cookieStore = await cookies();
        const sessionCartId = cookieStore.get("sessionCartId")?.value;

        if (sessionCartId) {
          const sessionCart = await prismaAuth.cart.findFirst({
            where: { sessionCartId },
          });

          if (sessionCart) {
            await prismaAuth.cart.deleteMany({ where: { userId: user.id } });
            await prismaAuth.cart.update({
              where: { id: sessionCart.id },
              data: { userId: user.id },
            });
          }
        }

        return true;
      } catch (error) {
        console.error("Cart merge failed:", error);
        return true; // Let them log in even if cart merge fails
      }
    },
  },
};
