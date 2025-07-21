// lib/auth/getSessionUser.ts
import { auth } from "@/auth-helpers/server";

export async function getSessionUser() {
  const session = await auth();
  return session?.user || null;
}
