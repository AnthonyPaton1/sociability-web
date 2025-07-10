// auth.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { compareSync } from "bcrypt-ts-edge";
import { prisma } from "./db/prisma";
import { cookies } from "next/headers";
import type { User as PrismaUser } from "@prisma/client";

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: "text" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const user = await prisma.user.findFirst({
          where: { email: credentials.email as string },
        });

        if (
          user?.password &&
          compareSync(credentials.password as string, user.password)
        ) {
          return user;
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.role = (user as PrismaUser).role;
        token.name = user.name ?? user.email?.split("@")[0];
      }

      // Manual session update via useSession().update(...)
      if (trigger === "update" && session?.user?.name) {
        token.name = session.user.name;
      }

      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as string;
      session.user.name = token.name;
      return session;
    },
    async signIn({ user }) {
      try {
        const cookieStore = await cookies();
        const sessionCartId = cookieStore.get("sessionCartId")?.value;

        if (sessionCartId) {
          const sessionCart = await prisma.cart.findFirst({
            where: { sessionCartId: sessionCartId },
          });

          if (sessionCart) {
            await prisma.cart.deleteMany({ where: { userId: user.id } });
            await prisma.cart.update({
              where: { id: sessionCart.id },
              data: { userId: user.id },
            });
          }
        }

        return true;
      } catch (error) {
        console.error("Cart merge failed:", error);
        return true;
      }
    },
  },
});

// import NextAuth from "next-auth";
// import { PrismaAdapter } from "@auth/prisma-adapter";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { compareSync } from "bcrypt-ts-edge";
// import { prisma } from "./db/prisma";
// import { authConfig } from "./authConfig"; // <--- your separate config with `authorized`

// export const config = {
//   ...authConfig,
//   pages: {
//     signIn: "/sign-in",
//     error: "/sign-in",
//   },
//   session: {
//     strategy: "jwt" as const,
//     maxAge: 30 * 24 * 60 * 60,
//   },
//   adapter: PrismaAdapter(prisma),
//   providers: [
//     CredentialsProvider({
//       credentials: {
//         email: { type: "email" },
//         password: { type: "password" },
//       },
//       async authorize(credentials) {
//         if (!credentials) return null;

//         const user = await prisma.user.findFirst({
//           where: { email: credentials.email as string },
//         });

//         if (user?.password) {
//           const isMatch = compareSync(
//             credentials.password as string,
//             user.password
//           );

//           if (isMatch) {
//             return {
//               id: user.id,
//               name: user.name,
//               email: user.email,
//               role: user.role,
//             };
//           }
//         }
//         //if no user or no password match return null
//         return null;
//       },
//     }),
//   ],
//   callbacks: {
//     ...authConfig.callbacks,
//     async session({ session, user, trigger, token }: any) {
//       session.user.id = token.sub;
//       session.user.role = token.role;
//       session.user.name = token.name;

//       if (trigger === "update") {
//         session.user.name = user.name;
//       }

//       return session;
//     },
//     async jwt({ token, user }: any) {
//       if (user) {
//         token.id = user.id;
//         token.role = user.role;

//         if (user.name === "NO_NAME") {
//           token.name = user.email!.split("@")[0];

//           await prisma.user.update({
//             where: { id: user.id },
//             data: { name: token.name },
//           });
//         }
//         if (trigger === "signIn" || trigger === "signUp") {
//           const cookiesObject = await cookies();
//           const sessionCartId = cookiesObject("sessioncartId")?.value;

//           if (sessionCartId) {
//             const sessionCart = await prisma.cart.findFirst({
//               whier: { sessioncartId },
//             });
//             if (sessioncart) {
//               await prisma.cart.deleteMany({
//                 where: { userId: user.id },
//               });
//               //assign new cart
//               await prisma.cart.update({
//                 where: { id: sessionCart.id },
//                 data: { userId: user.id },
//               });
//             }
//           }
//         }
//       }

//       return token;
//     },
//   },
// };

// export const { handlers, auth, signIn, signOut } = NextAuth(config);
