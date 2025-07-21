import { PrismaClient } from "@prisma/client";
import sampleData from "./sample-data";
import { hashSync } from "bcrypt-ts-edge";

const prisma = new PrismaClient();

async function main() {
  // Clean database
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.product.deleteMany();
  await prisma.vendor.deleteMany();
  await prisma.user.deleteMany();

  // Create admin and user manually
  await prisma.user.create({
    data: {
      name: "John",
      email: "admin@testtest.com",
      password: hashSync("123456", 10),
      role: "admin",
    },
  });

  await prisma.user.create({
    data: {
      name: "Jane",
      email: "user@testtest.com",
      password: hashSync("123456", 10),
      role: "user",
    },
  });

  // Create vendor user manually (not using createMany)
  const vendorUser = await prisma.user.create({
    data: {
      name: "Vince the Vendor",
      email: "vendor@testtest.com",
      password: hashSync("123456", 10),
      role: "vendors",
    },
  });

  const vendor = await prisma.vendor.create({
    data: {
      userId: vendorUser.id,
      businessName: "happy shopper co",
    },
  });

  // If your User model has vendorId column, set it
  await prisma.user.update({
    where: { id: vendorUser.id },
    data: {
      vendorId: vendor.id,
    },
  });
  const productsWithVendor = sampleData.products.map((product) => ({
    ...product,
    vendorId: vendor.id,
  }));

  await prisma.product.createMany({
    data: productsWithVendor,
    skipDuplicates: true,
  });

  console.log("✅ Vendor and Products seeded");

  console.log("✅ Vendor created:", vendor);
  console.log("✅ Database seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
