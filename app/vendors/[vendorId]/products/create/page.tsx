import { Metadata } from "next";
import { getSessionUser } from "@/lib/auth/getSessionUser";
import { redirect } from "next/navigation";
import ProductForm from "@/components/vendor/product-form";

export default async function NewProductPage() {
  const session = await getSessionUser();
  console.log("Session:", session)
  
  if (!session || session.role !== "vendor" || !session.vendorId) {
    redirect("/unauthorized");
  }
  console.log("Rendering form for vendor:", session.vendorId);

  return (
    <div>
      <ProductForm type="Create" vendorId={session.vendorId} />
    </div>
  );
}
