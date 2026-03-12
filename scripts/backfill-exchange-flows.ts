import { PrismaClient } from "@prisma/client";
import { fetchExchangeFlows } from "../src/lib/data-sources/exchange-flows";
import { normalizeExchangeFlowData } from "../src/lib/normalization/exchange-flows";
import { MAJOR_STABLECOINS, MAJOR_EXCHANGES } from "../src/lib/constants/regime";
import { getDaysAgo } from "../src/lib/utils/dates";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting exchange flow data backfill...");

  const days = parseInt(process.argv[2] || "90", 10);
  const startDate = getDaysAgo(days);
  const endDate = new Date();

  console.log(`Backfilling ${days} days of data from ${startDate} to ${endDate}`);

  // TODO: Implement backfill logic
  // 1. Fetch exchange flow data for major exchanges and stablecoins
  const rawData = await fetchExchangeFlows([...MAJOR_EXCHANGES], [...MAJOR_STABLECOINS]);
  const normalized = normalizeExchangeFlowData(rawData);

  // 2. Store in database
  // await prisma.exchangeFlow.createMany({
  //   data: normalized.map(item => ({
  //     exchange: item.exchange,
  //     token: item.token,
  //     flowType: item.flowType,
  //     amount: item.amount,
  //     amountUsd: item.amountUsd,
  //     timestamp: item.timestamp,
  //     source: item.source,
  //   })),
  //   skipDuplicates: true,
  // });

  console.log(`Backfilled ${normalized.length} exchange flow records`);
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
