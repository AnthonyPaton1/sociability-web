import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getOrderById } from "@/lib/actions/order.actions";
import { shippingAddress } from "@/types";
import OrderDetailsTable from "./order-details-table";

export const metadata: Metadata = {
  title: "Order Details",
};

interface Params {
  params: { id: string };
}

const OrderDetailsPage = async ({ params }: Params) => {
  const { id } = params;

  const rawOrder = await getOrderById(id);
  if (!rawOrder) notFound();
  const order = {
    ...rawOrder,
    User: rawOrder.user,
    orderItems: rawOrder.orderItems.map((item) => ({
      ...item,
      price: Number(item.price),
    })),
  };

  return (
    <div>
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
    </div>
  );
};

export default OrderDetailsPage;
