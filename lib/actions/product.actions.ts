"use server";
import { prisma } from "@/db/prisma";
import { LATEST_PRODUCTS_LIMIT, PAGE_SIZE } from "../constants";
import { formatError } from "../utils";
import { revalidatePath } from "next/cache";
import { insertProductSchema, updateProductSchema } from "../validators";
import z from "zod";
import { Prisma, PrismaClient } from "@prisma/client";
import { convertToPlainObject } from "../utils";
import { auth } from "@/auth-helpers/server";

type ExtendedSession = {
  user: {
      id: string;
    email: string;
    name?: string;
    role?: string;        
    vendorId?: string;   
    businessName?: string
  };
  
};

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

//get product by ID
export async function getProductById(productId: string) {
 
  const data = await prisma.product.findFirst({
    where: { id: productId },
  });

  return convertToPlainObject(data);
}

export async function getAllProducts({
  query,
  limit = PAGE_SIZE,
  page,
  category,
  vendorId,
  price,
  rating,
  sort
}: {
  query?: string;
  limit?: number;
  page: number;
  category?: string;
  vendorId?: string;
  price?: string;
  rating?: string;
  sort?: string;
}) {
   
  // Build where clause with filters and query filters
  const queryFilter: Prisma.ProductWhereInput =
    query && query !== "all"
      ? {
          name: {
            contains: query,
            mode: "insensitive",
          } as Prisma.StringFilter
        } 
      : {};

  const categoryFilter: Prisma.ProductWhereInput =
    category && category !== "all" ? { category } : {};

  const vendorFilter: Prisma.ProductWhereInput = vendorId ? { vendorId } : {};

  const priceFilter: Prisma.ProductWhereInput = 
    price && price !== 'all' && price.includes('-') ? {
      price: {
        gte: Number(price.split("-")[0]),
        lte: Number(price.split("-")[1]),
      }
    } : {};

  const ratingFilter: Prisma.ProductWhereInput = 
    rating && rating !== 'all' ? {
      rating: {
        gte: Number(rating),
      }
    } : {};

  const whereClause = {
    ...queryFilter,
    ...categoryFilter,
    ...vendorFilter,
    ...priceFilter,
    ...ratingFilter,
  };

  // Handle sorting
  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" }; 

  if (sort === "lowest") {
    orderBy = { price: "asc" };
  } else if (sort === "highest") {
    orderBy = { price: "desc" };
  } else if (sort === "toprated") {
    orderBy = { rating: "desc" };
  } else if (sort === "newest") {
    orderBy = { createdAt: "desc" };
  }

  const data = await prisma.product.findMany({
    where: whereClause,
    orderBy: orderBy, 
    skip: (page - 1) * limit,
    take: limit,
  });

  const dataCount = await prisma.product.count({
    where: whereClause,
  });

  return {
    data: data.map(serializeProduct),
    totalPages: Math.ceil(dataCount / limit),
  };
}

//delete a product
export async function DeleteProduct(id: string) {
    const session = (await auth()) as ExtendedSession | null;
if (!session) throw new Error("Unauthorized");
  try {
    
    const productExists = await prisma.product.findFirst({
      where: { id },
    });

    if (!productExists) throw new Error("Product not found");

    // Check if vendor owns this product (unless admin)
if (session.user.role !== "admin" && productExists.vendorId !== session.user.vendorId) {
  throw new Error("You don't have permission to delete this product");
}

    await prisma.product.delete({
      where: { id: id },
    });

    // Revalidate the vendor's product page
    revalidatePath(`/vendors/${productExists.vendorId}/products`);

    return {
      success: true,
      message: "Product deleted successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

//create a product
export async function createProduct(
  data: z.infer<typeof insertProductSchema>
) {
  try {
    const session = (await auth()) as ExtendedSession | null;
    if (!session || session.user.role !== "vendor") {
      throw new Error("Unauthorized - Vendor access required");
    }

    const product = insertProductSchema.parse(data);

    // Ensure the vendorId matches the session vendorId
    if (product.vendorId !== session.user.vendorId) {
      throw new Error("You can only create products for your own vendor account");
    }

    const newProduct = await prisma.product.create({ data: product });

    revalidatePath(`/vendors/${newProduct.vendorId}/products`);

    return {
      success: true,
      message: "Product successfully created",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

//update product
export async function updateProduct(
  
  data: z.infer<typeof updateProductSchema>
) {
  try {
     const session = (await auth()) as ExtendedSession | null;
if (!session) throw new Error("Unauthorized");

  

    const product = updateProductSchema.parse(data);
    const productExists = await prisma.product.findFirst({
      where: { id: product.id },
    });

    if (!productExists) throw new Error("Product not found");

    // Check if vendor owns this product (unless admin)
    if (
      session.user.role !== "admin" &&
      productExists.vendorId !== session.user.vendorId
    ) {
      throw new Error("You don't have permission to update this product");
    }

    await prisma.product.update({
      where: { id: product.id },
      data: product,
    });

    revalidatePath(`/vendors/${productExists.vendorId}/products`);

    return {
      success: true,
      message: "Product updated successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Admin only - toggle featured status
export async function toggleProductFeatured(
  productId: string,
  isFeatured: boolean
) {
  try {
    
     const session = (await auth()) as ExtendedSession | null;
if (!session) throw new Error("Unauthorized");

    await prisma.product.update({
      where: { id: productId },
      data: { isFeatured },
    });

    revalidatePath("/admin/products");

    return {
      success: true,
      message: `Product ${isFeatured ? "featured" : "unfeatured"} successfully`,
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

//get all categories

export async function getAllCategories() {
  const data = await prisma.product.groupBy({
    by: ['category'],
    _count: true
  })
  return data
}


