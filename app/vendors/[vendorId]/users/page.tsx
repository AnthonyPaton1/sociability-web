import { auth } from "@/auth-helpers/server";
import { requireVendorAccess } from "@/lib/auth/requireVendorAccess";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Users",
};

const VendorUsersPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ vendorId: string }>;
  searchParams: Promise<{ page?: string }>;
}) => {
  const { vendorId } = await params;
  const resolvedSearchParams = await searchParams;
  const page = resolvedSearchParams?.page || "1";

  await requireVendorAccess(vendorId);

  return <>Users</>;
};

export default VendorUsersPage;
