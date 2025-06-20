import { neonConfig } from "@neondatabase/serverless";
import { PrismaClient } from "@prisma/client";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

export const prisma = new PrismaClient().$extends({
  result: {
    product: {
      priceString: {
        compute(product) {
          return product.price.toString();
        },
      },
      ratingString: {
        compute(product) {
          return product.rating.toString();
        },
      },
    },
  },
});

// import { neonConfig } from "@neondatabase/serverless";
// import { PrismaNeon } from "@prisma/adapter-neon";
// import { PrismaClient } from "@prisma/client";

// import ws from "ws";

// // Required for Neon + WebSocket
// neonConfig.webSocketConstructor = ws;

// const adapter = new PrismaNeon({
//   connectionString: process.env.DATABASE_URL!,
// });

// export const prisma = new PrismaClient({ adapter }).$extends({
//   result: {
//     product: {
//       price: {
//         compute(product) {
//           return product.price.toString();
//         },
//       },
//       rating: {
//         compute(product) {
//           return product.rating.toString();
//         },
//       },
//     },
//   },
// });
