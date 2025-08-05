import { auth } from "@/auth-helpers/server";
import { requireVendorAccess } from "@/lib/auth/requireVendorAccess";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Products",
};

const VendorProductsPage = async ({
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

  return <>Products</>;
};

export default VendorProductsPage;
