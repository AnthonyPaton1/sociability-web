import { getSessionUser } from "@/lib/auth/getSessionUser";
import { redirect } from "next/navigation";

export default async function DashboardPage({
  params,
}: {
  params: { vendorId: string };
}) {
  const user = await getSessionUser();

  if (!user || user.vendorId !== params.vendorId) {
    redirect("/unauthorized");
  }

  return (
    <div>
      <h1>Vendor Dashboard for {user.businessName}</h1>
    </div>
  );
}
