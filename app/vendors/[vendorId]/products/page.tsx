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
  params: { vendorId: string };
  searchParams: { page?: string };
}) => {
  const { vendorId } = params;
  const page = searchParams?.page || "1";

  await requireVendorAccess(vendorId);

  return <>Products</>;
};

export default VendorProductsPage;
