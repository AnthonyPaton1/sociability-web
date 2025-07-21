import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

// For server-side use
export async function auth() {
  return await getServerSession(authOptions);
}
