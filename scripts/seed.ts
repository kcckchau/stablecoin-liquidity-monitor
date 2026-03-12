import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // TODO: Add seed data
  // Example:
  // await prisma.stablecoinSupply.createMany({
  //   data: [
  //     {
  //       symbol: "USDT",
  //       name: "Tether",
  //       supply: 95000000000,
  //       marketCap: 95000000000,
  //       timestamp: new Date(),
  //       source: "seed",
  //     },
  //   ],
  // });

  console.log("Seed completed!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
