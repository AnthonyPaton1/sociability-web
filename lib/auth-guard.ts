import { getSessionUser } from "./auth/getSessionUser";
import { redirect } from "next/navigation";

export async function requireRole(role: "vendor" | "admin" | "user") {
  const session = await getSessionUser();

  if (!session || session.role !== role) {
    redirect("/unauthorized");
  }

  return session;
}
