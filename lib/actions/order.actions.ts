"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { convertToPlainObject, formatError } from "../utils";
import { auth } from "@/auth";
import { getMyCart } from "./cart.actions";
import { getUserById } from "./user.actions";
import { insertOrderSchema } from "../validators";
import { prisma } from "@/db/prisma";
import { CartItem, PaymentResult } from "@/types";
import { paypal } from "../paypal";
import { revalidatePath } from "next/cache";
import { PAGE_SIZE } from "../constants";

//Create order and create order items

export async function createOrder() {
  try {
    const session = await auth();
    if (!session) throw new Error("User is not authenticated, Please log in");

    const cart = await getMyCart();
    const userId = session?.user?.id;
    if (!userId) throw new Error("User not found");

    const user = await getUserById(userId);

    if (!cart || cart.items.length === 0)
      return {
        success: false,
        message: "Your cart is empty",
        redirectTo: "/cart",
      };

    if (!user.address)
      return {
        success: false,
        message: "No shipping address",
        redirectTo: "shipping-address",
      };

    if (!user.paymentMethod)
      return {
        success: false,
        message: "No payment method",
        redirectTo: "/payment-method",
      };

    //create order object
    const order = insertOrderSchema.parse({
      userId: user.id,
      shippingAddress: user.address,
      paymentMethod: user.paymentMethod,
      itemsPrice: cart.itemsPrice,
      shippingPrice: cart.shippingPrice,
      taxPrice: cart.taxPrice,
      totalPrice: cart.totalPrice,
    });

    //create a transaction to create order and order items in the db
    const insertedOrderId = await prisma.$transaction(async (tx) => {
      //Create order
      const insertedOrder = await tx.order.create({ data: order });
      //create orderItems from cart items
      for (const item of cart.items as CartItem[]) {
        await tx.orderItem.create({
          data: {
            ...item,
            price: item.price,
            orderId: insertedOrder.id,
          },
        });
      }
      //clear cart
      await tx.cart.update({
        where: { id: cart.id },
        data: {
          items: [],
          totalPrice: 0,
          taxPrice: 0,
          shippingPrice: 0,
          itemsPrice: 0,
        },
      });
      return insertedOrder.id;
    });

    if (!insertedOrderId) throw new Error("Order was not created");

    return {
      success: true,
      message: "order created",
      redirectTo: `/order/${insertedOrderId}`,
    };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return { success: false, message: formatError(error) };
  }
}

//get order by ID
export async function getOrderById(orderId: string) {
  const data = await prisma.order.findFirst({
    where: {
      id: orderId,
    },
    include: {
      orderItems: true,
      user: { select: { name: true, email: true } },
    },
  });
  return convertToPlainObject(data);
}

//create new paypal order
export async function createPayPalOrder(orderId: string) {
  try {
    //get order from db
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
      },
    });
    if (order) {
      //create paypal order
      const paypalOrder = await paypal.createOrder(Number(order.totalPrice));

      //update order with paypal orderID
      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentResult: {
            id: paypalOrder.id,
            email_address: "",
            status: "",
            pricePaid: 0,
          },
        },
      });
      return {
        success: true,
        message: "Item order created successfully",
        data: paypalOrder.id,
      };
    } else {
      throw new Error("Order not found");
    }
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Approve paypal order and update order to paid
export async function approvePayPalOrder(
  orderId: string,
  data: { orderId: string }
) {
  try {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
      },
    });

    if (!order) throw new Error("Order not found");

    const captureData = await paypal.capturePayment(data.orderId);

    if (
      !captureData ||
      captureData.id !== (order.paymentResult as PaymentResult)?.id ||
      captureData.status !== "COMPLETED"
    ) {
      throw new Error("Error in Paypal payment");
    }

    //update order to paid
    await updateOrderToPaid({
      orderId,
      paymentResult: {
        id: captureData.id,
        status: captureData.status,
        email_address: captureData.payer.email_address,
        pricePaid:
          captureData.purchase_units[0]?.payments?.captures[0]?.amount?.value,
      },
    });

    revalidatePath(`/order/${orderId}`);

    return {
      success: true,
      message: "Your order has been paid",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

//update order to paid
async function updateOrderToPaid({
  orderId,
  paymentResult,
}: {
  orderId: string;
  paymentResult?: PaymentResult;
}) {
  //get order from db
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
    },
    include: {
      orderItems: true,
    },
  });
  if (!order) throw new Error("Order not found");

  if (order.isPaid) throw new Error("Order is already paid");

  //Transaction time to update order and account and reduce stock
  await prisma.$transaction(async (tx) => {
    //iterate over products and update stock
    for (const item of order.orderItems) {
      await tx.product.update({
        where: {
          id: item.productId,
        },
        data: { stock: { increment: -item.quantity } },
      });
    }
    // set the order to paid
    await tx.order.update({
      where: { id: orderId },
      data: {
        isPaid: true,
        paidAt: new Date(),
        paymentResult,
      },
    });
  });

  //get updated order afetr transaction
  const updatedOrder = await prisma.order.findFirst({
    where: { id: orderId },
    include: {
      orderItems: true,
      user: { select: { name: true, email: true } },
    },
  });

  if (!updatedOrder) throw new Error("Order not found");
}

//Get users orders
export async function getMyOrders({
  limit = PAGE_SIZE,
  page,
}: {
  limit?: number;
  page: number;
}) {
  const session = await auth();
  if (!session) throw new Error("User is not authorised");

  const data = await prisma.order.findMany({
    where: { userId: session?.user?.id! },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: (page - 1) * limit,
  });
  const dataCount = await prisma.order.count({
    where: { userId: session?.user?.id! },
  });
  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}
