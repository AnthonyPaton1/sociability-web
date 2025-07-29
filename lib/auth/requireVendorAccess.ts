// lib/auth/requireVendorAccess.ts
import { getSessionUser } from "./getSessionUser";
import { redirect } from "next/navigation";

export async function requireVendorAccess(vendorId: string) {
  const session = await getSessionUser();

  const isNotVendor = session?.role !== "vendor";
  const wrongVendor = session?.vendorId !== vendorId;

  if (!session || isNotVendor || wrongVendor) {
    redirect("/unauthorized");
  }

  return session;
}
