"use server";
import { signUpFormSchema } from "../validators";
import { signInFormSchema } from "../validators";
import { auth } from "@/auth-helpers/server";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { hashSync } from "bcrypt-ts-edge";
import { prisma } from "@/db/prisma";
import { formatError } from "../utils";
import { shippingAddressSchema } from "../validators";
import { paymentMethodSchema } from "../validators";
import { shippingAddress } from "@/types";
import { z } from "zod";
import { PAGE_SIZE } from "../constants";

//sign the user in with credentials provider
export async function signInWithCredentials(
  prevState: unknown,
  formdata: FormData
) {
  try {
    const user = signInFormSchema.parse({
      email: formdata.get("email"),
      password: formdata.get("password"),
    });

    return { success: true, message: "Signed in successfully" };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return { success: false, message: "Invalid email or password" };
  }
}

export async function signUpUser(prevState: unknown, FormData: FormData) {
  try {
    const user = signUpFormSchema.parse({
      name: FormData.get("name"),
      email: FormData.get("email"),
      password: FormData.get("password"),
      confirmPassword: FormData.get("confirmPassword"),
    });

    const plainPassword = user.password;
    user.password = hashSync(user.password, 10);

    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });

    // ✅ Instead of calling signIn here (not supported server-side)
    // Let the client redirect and call signIn

    return { success: true, message: "User registered successfully" };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: await formatError(error) };
  }
}

// get user by id

export async function getUserById(userId: string) {
  const user = await prisma.user.findFirst({
    where: { id: userId },
  });
  if (!user) throw new Error("User not found");
  return user;
}

//update the users address
export async function updateUserAddress(data: shippingAddress) {
  try {
    const session = await auth();

    const currentUser = await prisma.user.findFirst({
      where: { id: session?.user?.id },
    });
    if (!currentUser) throw new Error("User not found");
    const address = shippingAddressSchema.parse(data);
    await prisma.user.update({
      where: { id: currentUser.id },
      data: { address },
    });

    return {
      success: true,
      message: "User updated successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

//Update user payment method
export async function updateUserPaymentMethod(
  data: z.infer<typeof paymentMethodSchema>
) {
  try {
    const session = await auth();
    const currentUser = await prisma.user.findFirst({
      where: { id: session?.user?.id },
    });
    if (!currentUser) throw new Error("User not found");

    const paymentMethod = paymentMethodSchema.parse(data);

    await prisma.user.update({
      where: { id: currentUser.id },
      data: { paymentMethod: paymentMethod.type },
    });

    return {
      success: true,
      message: "User updated successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Update the user profile
export async function updateProfile(user: { name: string; email: string }) {
  try {
    const session = await auth();

    const currentUser = await prisma.user.findFirst({
      where: {
        id: session?.user?.id,
      },
    });

    if (!currentUser) throw new Error("User not found");

    await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        name: user.name,
      },
    });

    return {
      success: true,
      message: "User updated successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// get all users
export async function getAllUsers({
  limit = PAGE_SIZE,
  page 

} : {
  limit?: number;
  page: number;
}) {
  const data = await prisma.user.findMany({
    orderBy: {createdAt: 'desc'},
    take: limit,
    skip: (page - 1) * limit
  })
  const dataCount = await prisma.user.count()

  return {
    data,
    totalPages: Math.ceil(dataCount / limit)
  }
 }

// Get customers who have ordered from a specific vendor
export async function getVendorCustomers({
  vendorId,
  page,
  limit = PAGE_SIZE,
}: {
  vendorId: string;
  page: number;
  limit?: number;
}) {
  const customers = await prisma.user.findMany({
    where: {
      Order: {
        some: {
          orderItems: {
            some: {
              product: {
                vendorId: vendorId,
              },
            },
          },
        },
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
      Order: {
        where: {
          orderItems: {
            some: {
              product: {
                vendorId: vendorId,
              },
            },
          },
        },
        select: {
          id: true,
          createdAt: true,
          totalPrice: true,
          isPaid: true,
          isDelivered: true,
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 5, // Show last 5 orders per customer
      },
    },
    skip: (page - 1) * limit,
    take: limit,
  });

  const totalCount = await prisma.user.count({
    where: {
      Order: {
        some: {
          orderItems: {
            some: {
              product: {
                vendorId: vendorId,
              },
            },
          },
        },
      },
    },
  });

  return {
    data: customers.map((customer) => ({
      ...customer,
      orderCount: customer.Order.length,
      orders: customer.Order,
    })),
    totalPages: Math.ceil(totalCount / limit),
  };
}