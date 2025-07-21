import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      id: string;
      role: string;
      vendorId?: string;
      businessName?: string;
    };
  }

  interface User extends DefaultUser {
    role: string;
    vendorId?: string;
    businessName?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    vendorId?: string;
    businessName?: string;
    name?: string;
    email?: string;
  }
}
