import { Metadata } from "next";
import { getOrderById } from "@/lib/actions/order.actions";
import { notFound } from "next/navigation";
import { shippingAddress } from "@/types";
import OrderDetailsTable from "./order-details-table";

export const metadata: Metadata = {
  title: "Order Details",
};

const OrderDetailsPage = async ({ params }: { params: { id: string } }) => {
  const { id } = params;

  console.log("🛒 Order ID received:", id);

  const rawOrder = await getOrderById(id);
  if (!rawOrder) notFound();
  console.log("✅ Raw order object:", rawOrder);

  const order = {
    ...rawOrder,
    User: rawOrder.user,
    orderItems: rawOrder.orderItems.map((item) => ({
      ...item,
      price: Number(item.price),
    })),
    itemsPrice: Number(rawOrder.itemsPrice),
    shippingPrice: Number(rawOrder.shippingPrice),
    taxPrice: Number(rawOrder.taxPrice),
    totalPrice: Number(rawOrder.totalPrice),
  };
  console.log("PayPal Client ID", process.env.PAYPAL_CLIENT_ID);

  return (
    <OrderDetailsTable
      order={{
        ...order,
        itemsPrice: Number(order.itemsPrice),
        shippingPrice: Number(order.shippingPrice),
        taxPrice: Number(order.taxPrice),
        totalPrice: Number(order.totalPrice),
        shippingAddress: order.shippingAddress as shippingAddress,
        User: order.User,
        deliveredAt: order.deliveredAt,
        paidAt: order.paidAt,
        isDelivered: order.isDelivered,
        isPaid: order.isPaid,
        orderItems: order.orderItems,
        id: order.id,
        createdAt: order.createdAt,
        paymentMethod: order.paymentMethod,
      }}
      paypalClientId={process.env.PAYPAL_CLIENT_ID || "sb"}
    />
  );
};

export default OrderDetailsPage;
