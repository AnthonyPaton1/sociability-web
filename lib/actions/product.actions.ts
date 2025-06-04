"use server";

import { prisma } from "@/db/prisma";
import { LATEST_PRODUCTS_LIMIT } from "../constants";

// Helper to convert Prisma Decimal fields to plain number
function serializeProduct(product: any) {
  return {
    ...product,
    price: Number(product.price),
    rating: Number(product.rating),
  };
}

export async function getLatestProducts() {
  const data = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: { createdAt: "desc" },
  });

  return data.map(serializeProduct);
}

// Get single product by slug
export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findFirst({
    where: { slug },
  });

  return product ? serializeProduct(product) : null;
}
