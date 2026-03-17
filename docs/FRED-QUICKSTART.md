# FRED Integration - Quick Start Guide

Get FRED macro liquidity data integrated in 5 minutes.

---

## Step 1: Get API Key (2 minutes)

1. Go to: https://fred.stlouisfed.org/docs/api/api_key.html
2. Sign up (free, no credit card)
3. Request API key (instant)
4. Copy your key

---

## Step 2: Configure Environment (30 seconds)

Add to `.env.local`:

```bash
FRED_API_KEY="your_api_key_here"
```

---

## Step 3: Run Migration (1 minute)

```bash
npx prisma migrate dev --name add_fred_data
npx prisma generate
```

This creates the `FredData` table in your database.

---

## Step 4: Test the Integration (1 minute)

Create a test file: `test-fred.ts`

```typescript
import { fetchFredSeries } from "./src/lib/data-sources/fred";
import { FRED_SERIES } from "./src/lib/constants/fred-series";

async function test() {
  try {
    console.log("Fetching RRP data from FRED...");
    
    const result = await fetchFredSeries({
      seriesId: FRED_SERIES.RRP,
      limit: 5,
      sortOrder: "desc",
    });

    console.log(`\n✅ Success! Fetched ${result.observations.length} observations\n`);

    result.observations.forEach((obs, i) => {
      console.log(`${i + 1}. Date: ${obs.date.toISOString().split('T')[0]}`);
      console.log(`   Value: $${obs.value.toFixed(2)} ${obs.units}\n`);
    });
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

test();
```

Run it:

```bash
npx tsx test-fred.ts
```

Expected output:

```
Fetching RRP data from FRED...

✅ Success! Fetched 5 observations

1. Date: 2026-03-17
   Value: $2456.78 Billions of Dollars

2. Date: 2026-03-16
   Value: $2445.23 Billions of Dollars

...
```

---

## Step 5: Store Data in Database (Optional)

```typescript
import { fetchFredSeries } from "./src/lib/data-sources/fred";
import { FRED_SERIES } from "./src/lib/constants/fred-series";
import { toPrismaFormat } from "./src/lib/normalization/fred";
import { prisma } from "./src/lib/db";

async function storeData() {
  const result = await fetchFredSeries({
    seriesId: FRED_SERIES.RRP,
    limit: 30, // Last 30 days
  });

  for (const obs of result.observations) {
    await prisma.fredData.upsert({
      where: {
        seriesId_date: {
          seriesId: obs.seriesId,
          date: obs.date,
        },
      },
      create: toPrismaFormat(obs),
      update: toPrismaFormat(obs),
    });
  }

  console.log(`Stored ${result.observations.length} observations`);
}

storeData();
```

---

## Available Functions

### Fetch from API

```typescript
import { fetchFredSeries, fetchLatestFredObservation } from "@/lib/data-sources/fred";
import { FRED_SERIES } from "@/lib/constants/fred-series";

// Fetch multiple observations
const result = await fetchFredSeries({
  seriesId: FRED_SERIES.RRP,
  startDate: new Date("2024-01-01"),
  limit: 1000,
});

// Fetch just the latest
const latest = await fetchLatestFredObservation(FRED_SERIES.TGA);
```

### Query from Database

```typescript
import { 
  getLatestFredObservation,
  getRecentFredObservations,
  getFredChangeOverPeriod,
} from "@/lib/queries/fred";

// Get latest stored value
const latest = await getLatestFredObservation(FRED_SERIES.RRP);

// Get last 30 days
const recent = await getRecentFredObservations(FRED_SERIES.RRP, 30);

// Calculate 7-day change
const change = await getFredChangeOverPeriod(FRED_SERIES.RRP, 7);
console.log(`7D change: ${change?.change.percent.toFixed(2)}%`);
```

---

## What's Available

### Series

| Series | ID | Description | Units |
|--------|----|----|-------|
| **RRP** | RRPONTSYD | Overnight Reverse Repo | Billions of Dollars |
| **TGA** | WTREGEN | Treasury General Account | Millions of Dollars |

### Liquidity Signals

- **RRP ⬆️** = Liquidity ⬆️ (Risk-On)
- **TGA ⬆️** = Liquidity ⬇️ (Risk-Off)

---

## Next Steps

1. **Create a cron job** to fetch data daily
2. **Add to dashboard** as new metrics
3. **Combine with stablecoin data** for composite liquidity score

See `docs/FRED-INTEGRATION.md` for full documentation.

---

## Troubleshooting

### "FRED_API_KEY is not configured"

- Make sure you added `FRED_API_KEY` to `.env.local`
- Restart your dev server

### "Module not found"

- Run `npm install` to ensure dependencies are installed
- Run `npx prisma generate` to regenerate Prisma client

### "Table does not exist"

- Run the migration: `npx prisma migrate dev`

---

**All Done!** 🎉 FRED integration is ready to use.
