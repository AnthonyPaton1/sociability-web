"use server";

import { prisma } from "@/db/prisma";
import { auth } from "@/auth-helpers/server";
import { formatError } from "../utils";

type ExtendedSession = {
  user: {
    id: string;
    email: string;
    name?: string;
    role?: string;
  };
};

export async function getAllVendors() {
  try {
    const session = (await auth()) as ExtendedSession | null;
    if (!session || session.user.role !== "admin") {
      throw new Error("Unauthorized - Admin access required");
    }

    const vendors = await prisma.vendor.findMany({ 
      select: {
        id: true,
        businessName: true,
        userId: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
          },
        },
        _count: {
          select: {
            products: true,  // ← This is correct for Vendor model
          },
        },
      },
      orderBy: { user: { createdAt: "desc" } },
    });

    // Get order counts for each vendor
    const vendorsWithStats = await Promise.all(
      vendors.map(async (vendor) => {
        const orderCount = await prisma.order.count({
          where: {
            orderItems: {
              some: {
                product: {
                  vendorId: vendor.id,  // ← Use vendor.id, not user.vendorId
                },
              },
            },
          },
        });

        const revenue = await prisma.order.findMany({
          where: {
            isPaid: true,
            orderItems: {
              some: {
                product: {
                  vendorId: vendor.id,  // ← Use vendor.id
                },
              },
            },
          },
          select: {
            orderItems: {
              where: {
                product: {
                  vendorId: vendor.id,  // ← Use vendor.id
                },
              },
              select: {
                price: true,
                quantity: true,
              },
            },
          },
        });

        const totalRevenue = revenue.reduce((sum, order) => {
          const orderTotal = order.orderItems.reduce(
            (itemSum, item) => itemSum + Number(item.price) * item.quantity,
            0
          );
          return sum + orderTotal;
        }, 0);

        return {
          id: vendor.id,
          vendorId: vendor.id,
          businessName: vendor.businessName,
          name: vendor.user.name,
          email: vendor.user.email,
          createdAt: vendor.user.createdAt,
          productCount: vendor._count.products,
          orderCount,
          totalRevenue,
        };
      })
    );

    return { success: true, data: vendorsWithStats };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}



export async function getAdminDashboardStats() {
  try {
    const session = (await auth()) as ExtendedSession | null;
    if (!session || session.user.role !== "admin") {
      throw new Error("Unauthorized - Admin access required");
    }

    // Total revenue
    const orders = await prisma.order.findMany({
      where: { isPaid: true },
      select: { totalPrice: true },
    });
    const totalRevenue = orders.reduce(
      (sum, order) => sum + Number(order.totalPrice),
      0
    );

    // Total orders
    const totalOrders = await prisma.order.count();
    const pendingOrders = await prisma.order.count({
      where: { isPaid: false },
    });

    // Total vendors
    const totalVendors = await prisma.user.count({
      where: { role: "vendor" },
    });

    // Total users (customers)
    const totalUsers = await prisma.user.count({
      where: { role: "user" },
    });

    // Recent orders
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
    });

    // Top products by sales
    const topProducts = await prisma.product.findMany({
      take: 5,
      include: {
        _count: {
          select: { orderItems: true },
        },
      },
      orderBy: {
        orderItems: {
          _count: "desc",
        },
      },
    });

    return {
      totalRevenue,
      totalOrders,
      pendingOrders,
      totalVendors,
      totalUsers,
      recentOrders,
      topProducts,
    };
  } catch (error) {
    throw new Error(formatError(error));
  }
}

