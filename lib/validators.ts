import { z } from "zod";

import { paymentMethods } from "./constants";

export const currency = z.coerce
  .number()
  .refine((val) => /^\d+(\.\d{2})?$/.test(val.toFixed(2)), {
    message: "Price must have exactly 2 decimal places",
  });

// Schema for inserting products
export const insertProductSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  category: z.string().min(1),
  ageRange: z.string().optional(),
  gameType: z.string().optional(),
  material: z.string().optional(),
  certifications: z.array(z.string()).optional(),
  brand: z.string(),
  description: z.string(),
  price: z.coerce.number().nonnegative(),
  stock: z.coerce.number().int().nonnegative(),
  rating: z.coerce.number().optional(),
  numReviews: z.coerce.number().optional(),
  isFeatured: z.coerce.boolean(),
   vendorId: z.string().uuid("Valid vendor ID is required"),
  //banner: z.string().nullable().optional(),
  images: z.array(z.string()).min(1, "Product must have at least one image"),
});

//schema for updating a product
export const updateProductSchema = insertProductSchema.extend({
  id: z.string().uuid(),
});

//Schema for signing users in
export const signInFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

//Schema for signing up a user in
export const signUpFormSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Confirm Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "passwords don't match",
    path: ["confirmPassowrd"],
  });

//cart schemas

export const cartItemSchema = z.object({
  productId: z.string().min(1, "Product"),
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  quantity: z.number().int().nonnegative("Quantity must be a positive number"),
  image: z.string().min(1, "Image is required"),
  price: currency,
});

export const insertCartSchema = z.object({
  items: z.array(cartItemSchema),
  itemsPrice: currency,
  totalPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  sessionCartId: z.string().min(1, "session cart id is required"),
  userId: z.string().optional().nullable(),
});

// shipping address schema
export const shippingAddressSchema = z.object({
  fullName: z.string().min(3, "Name must be at least 3 characters"),
  streetAddress: z.string().min(3, "Address must be at least 3 characters"),
  city: z.string().min(3, "City must be at least 3 characters"),
  postCode: z.string().min(3, "PostCode must be at least 3 characters"),
  country: z.string().min(3, "country must be at least 3 characters"),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

export const paymentMethodSchema = z
  .object({
    type: z.string().min(1, "Payment method is required"),
  })
  .refine((data) => paymentMethods.includes(data.type), {
    path: ["type"],
    message: "Invalid payment method",
  });

// schema for insert order
export const insertOrderSchema = z.object({
  userId: z.string().min(1, "User is required"),
  itemsPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  totalPrice: currency,
  paymentMethod: z.string().refine((data) => paymentMethods.includes(data), {
    message: "Invalid payment method",
  }),
  shippingAddress: shippingAddressSchema,
});

//schema for insert order item
export const insertOrderItemSchema = z.object({
  productId: z.string(),
  slug: z.string(),
  image: z.string(),
  name: z.string(),
  price: currency,
  quantity: z.number(),
});

// payment result schema

export const paymentResultSchema = z.object({
  id: z.string(),
  status: z.string(),
  email_address: z.string(),
  pricePaid: z.string(),
});

// Schema for updating the user profile
export const updateProfileSchema = z.object({
  name: z.string().min(3, "Name must be at leaast 3 characters"),
  email: z.string().min(3, "Email must be at leaast 3 characters"),
});

// Schema to update users
export const updateUserSchema = updateProfileSchema.extend({
  id: z.string().min(1, "ID is required"),
  role: z.string().min(1, "Role is required"),
});
