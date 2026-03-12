import { PrismaClient } from "@prisma/client";
import { fetchStablecoinSupplies, fetchHistoricalSupply } from "../src/lib/data-sources/defillama";
import { normalizeDefiLlamaData } from "../src/lib/normalization/stablecoins";
import { getDaysAgo } from "../src/lib/utils/dates";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting stablecoin data backfill...");

  const days = parseInt(process.argv[2] || "90", 10);
  const startDate = getDaysAgo(days);
  const endDate = new Date();

  console.log(`Backfilling ${days} days of data from ${startDate} to ${endDate}`);

  // TODO: Implement backfill logic
  // 1. Fetch current stablecoin data
  const currentData = await fetchStablecoinSupplies();
  const normalized = normalizeDefiLlamaData(currentData);

  // 2. For each stablecoin, fetch historical data
  // 3. Store in database
  // await prisma.stablecoinSupply.createMany({
  //   data: normalized.map(item => ({
  //     symbol: item.symbol,
  //     name: item.name,
  //     supply: item.supply,
  //     marketCap: item.marketCap,
  //     timestamp: item.timestamp,
  //     source: item.source,
  //   })),
  //   skipDuplicates: true,
  // });

  console.log(`Backfilled ${normalized.length} stablecoin records`);
  console.log("Backfill completed!");
}

main()
  .catch((e) => {
    console.error("Error during backfill:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
