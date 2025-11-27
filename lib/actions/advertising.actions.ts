"use server";

import { prisma } from "@/db/prisma";
import { formatError } from "../utils";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth-helpers/server";

type ExtendedSession = {
  user: {
    id: string;
    email: string;
    name?: string;
    role?: string;
  };
};

// Get active banners for carousel (public)
export async function getActiveBanners() {
  const banners = await prisma.banner.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });

  return banners;
}

// Admin: Get all banners
export async function getAllBanners() {
  try {
    const session = (await auth()) as ExtendedSession | null;
    if (!session || session.user.role !== "admin") {
      throw new Error("Unauthorized - Admin access required");
    }

    const banners = await prisma.banner.findMany({
      orderBy: { order: "asc" },
    });

    return { success: true, data: banners };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function createBanner(data: {
  title: string;
  image: string;
  link?: string;
  order?: number;
  isActive?: boolean;  // ← Add this
}) {
  try {
    const session = (await auth()) as ExtendedSession | null;
    if (!session || session.user.role !== "admin") {
      throw new Error("Unauthorized - Admin access required");
    }


    await prisma.banner.create({
      data: {
        title: data.title,
        image: data.image,
        link: data.link || null,
        order: data.order || 0,
        isActive: data.isActive ?? true,  
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/banners");

    return {
      success: true,
      message: "Banner created successfully",
    };
  } catch (error) {
    console.error("=== CREATE BANNER ERROR ===", error);
    return { success: false, message: formatError(error) };
  }
}

// Admin: Update banner
export async function updateBanner(data: {
  id: string;
  title: string;
  image: string;
  link?: string;
  order?: number;
  isActive?: boolean;
}) {
  try {
    const session = (await auth()) as ExtendedSession | null;
    if (!session || session.user.role !== "admin") {
      throw new Error("Unauthorized - Admin access required");
    }

    await prisma.banner.update({
      where: { id: data.id },
      data: {
        title: data.title,
        image: data.image,
        link: data.link,
        order: data.order,
        isActive: data.isActive,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/banners");

    return {
      success: true,
      message: "Banner updated successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Admin: Delete banner
export async function deleteBanner(id: string) {
  try {
    const session = (await auth()) as ExtendedSession | null;
    if (!session || session.user.role !== "admin") {
      throw new Error("Unauthorized - Admin access required");
    }

    await prisma.banner.delete({
      where: { id },
    });

    revalidatePath("/");
    revalidatePath("/admin/banners");

    return {
      success: true,
      message: "Banner deleted successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Admin: Toggle active status
export async function toggleBannerActive(id: string, isActive: boolean) {
  try {
    const session = (await auth()) as ExtendedSession | null;
    if (!session || session.user.role !== "admin") {
      throw new Error("Unauthorized - Admin access required");
    }

    await prisma.banner.update({
      where: { id },
      data: { isActive },
    });

    revalidatePath("/");
    revalidatePath("/admin/banners");

    return {
      success: true,
      message: `Banner ${isActive ? "activated" : "deactivated"} successfully`,
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
export async function getBannerById(id: string) {
  try {
    const session = (await auth()) as ExtendedSession | null;
    if (!session || session.user.role !== "admin") {
      throw new Error("Unauthorized - Admin access required");
    }

    const banner = await prisma.banner.findUnique({
      where: { id },
    });

    return banner;
  } catch (error) {
    return null;
  }
}