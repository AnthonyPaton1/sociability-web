import { auth } from "@/auth";
import { Metadata } from "next";
import { getMyCart } from "@/lib/actions/cart.actions";
import { getUserById } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import { shippingAddress } from "@/types";
import ShippingAddressForm from "./shipping-address-form";
import CheckoutSteps from "@/components/shared/header/checkout-steps";

export const metadata: Metadata = {
  title: "Shipping Address",
};

const ShippingAddressPage = async () => {
  const cart = await getMyCart();

  if (!cart || cart.items.length === 0) redirect("/cart");

  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("No user ID");
  const user = await getUserById(userId);

  return (
    <>
      <CheckoutSteps current={1} />
      <ShippingAddressForm address={user.address as shippingAddress} />
    </>
  );
};

export default ShippingAddressPage;
