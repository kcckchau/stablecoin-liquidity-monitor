# FRED API Integration

**Status**: ✅ COMPLETE (Scaffold)  
**Date**: 2026-03-17

---

## Overview

This document describes the FRED (Federal Reserve Economic Data) integration layer for fetching macro liquidity indicators. The implementation provides a clean, isolated data source layer that is ready to be integrated into the dashboard in a future task.

**What's Built**: Complete scaffold with constants, API client, normalization, database schema, and queries.  
**What's NOT Built**: Dashboard integration, cron jobs, UI components (by design).

---

## Architecture

### Layer Structure

```
┌─────────────────────────────────────┐
│  Constants Layer                    │
│  fred-series.ts                     │
│  - Series IDs (RRP, TGA)            │
│  - Metadata (names, units, etc.)    │
│  - Helper functions                 │
└──────────────┬──────────────────────┘
               │ used by
               ▼
┌─────────────────────────────────────┐
│  Data Source Layer                  │
│  fred.ts (in data-sources/)         │
│  - API client                       │
│  - Fetch functions                  │
│  - Error handling                   │
└──────────────┬──────────────────────┘
               │ returns raw data to
               ▼
┌─────────────────────────────────────┐
│  Normalization Layer                │
│  fred.ts (in normalization/)        │
│  - Parse FRED responses             │
│  - Convert to internal types        │
│  - Format for database              │
└──────────────┬──────────────────────┘
               │ prepared for
               ▼
┌─────────────────────────────────────┐
│  Persistence Layer                  │
│  - Prisma schema (FredData model)   │
│  - Query helpers (fred.ts)          │
│  - CRUD operations                  │
└─────────────────────────────────────┘
```

---

## Files Created

### 1. **`src/lib/constants/fred-series.ts`**

Defines FRED series IDs and metadata.

**Exports:**
- `FRED_SERIES` - Series ID constants
  - `RRP`: "RRPONTSYD" (Reverse Repo)
  - `TGA`: "WTREGEN" (Treasury General Account)
- `FredSeriesId` - Type-safe series ID union
- `FredSeriesMetadata` - Metadata interface
- `FRED_SERIES_METADATA` - Full metadata catalog

**Helper Functions:**
- `getFredSeriesMetadata(seriesId)` - Get metadata for a series
- `getAllFredSeriesIds()` - Get array of all series IDs
- `isValidFredSeriesId(value)` - Validate a series ID

**Example:**
```typescript
import { FRED_SERIES, getFredSeriesMetadata } from "@/lib/constants/fred-series";

const rrpMetadata = getFredSeriesMetadata(FRED_SERIES.RRP);
console.log(rrpMetadata?.name); // "Overnight Reverse Repo"
console.log(rrpMetadata?.units); // "Billions of Dollars"
```

---

### 2. **`src/lib/types/fred.ts`**

Type definitions for FRED API.

**Key Types:**
- `FredApiResponse` - Raw API response structure
- `FredObservation` - Single observation from API
- `FredDataPoint` - Normalized internal data point
- `FredFetchOptions` - Options for fetching data
- `FredFetchResult` - Result of a fetch operation

**Example:**
```typescript
import type { FredDataPoint } from "@/lib/types/fred";

const dataPoint: FredDataPoint = {
  seriesId: "RRPONTSYD",
  date: new Date("2026-03-17"),
  value: 2500.5, // Billions
  units: "Billions of Dollars",
  realtimeStart: new Date("2026-03-17"),
  realtimeEnd: new Date("9999-12-31"),
};
```

---

### 3. **`src/lib/data-sources/fred.ts`**

API client for fetching FRED data.

**Key Functions:**

#### `fetchFredSeries(options)`
Fetch observations for a specific series.

```typescript
import { fetchFredSeries } from "@/lib/data-sources/fred";
import { FRED_SERIES } from "@/lib/constants/fred-series";

const result = await fetchFredSeries({
  seriesId: FRED_SERIES.RRP,
  startDate: new Date("2024-01-01"),
  endDate: new Date("2024-12-31"),
  limit: 1000,
  sortOrder: "asc",
});

console.log(result.observations.length); // Array of data points
console.log(result.totalCount); // Total observations
```

#### `fetchLatestFredObservation(seriesId)`
Get the most recent observation.

```typescript
const latest = await fetchLatestFredObservation(FRED_SERIES.TGA);
console.log(`Latest TGA: ${latest.value} million`);
```

#### `fetchMultipleFredSeries(seriesIds, options)`
Fetch multiple series in parallel.

```typescript
const [rrp, tga] = await fetchMultipleFredSeries(
  [FRED_SERIES.RRP, FRED_SERIES.TGA],
  { startDate: new Date("2024-01-01") }
);
```

**Configuration:**
- Requires `FRED_API_KEY` environment variable
- Base URL: `https://api.stlouisfed.org/fred`
- Default limit: 1000 observations
- Default sort: ascending by date

---

### 4. **`src/lib/normalization/fred.ts`**

Converts FRED API responses to internal format.

**Key Functions:**

#### `normalizeFredResponse(response, seriesId)`
Normalize a full API response.

```typescript
import { normalizeFredResponse } from "@/lib/normalization/fred";

const rawResponse = await fetch(fredApiUrl).then(r => r.json());
const normalized = normalizeFredResponse(rawResponse, FRED_SERIES.RRP);

// normalized.observations is array of FredDataPoint
```

#### `toPrismaFormat(dataPoint)`
Convert to Prisma-compatible format for database insertion.

```typescript
const prismaData = toPrismaFormat(dataPoint);
await prisma.fredData.create({ data: prismaData });
```

#### `fromPrismaFormat(record)`
Convert Prisma record back to internal format.

```typescript
const record = await prisma.fredData.findFirst({ where: { seriesId: "RRPONTSYD" } });
const dataPoint = fromPrismaFormat(record);
```

#### `formatFredValue(value, units)`
Format values for display.

```typescript
formatFredValue(2500, "Billions of Dollars"); // "2.50T"
formatFredValue(150000, "Millions of Dollars"); // "150.00B"
```

#### `calculateFredChange(current, previous)`
Calculate change between two values.

```typescript
const change = calculateFredChange(2600, 2500);
// { absolute: 100, percent: 4, direction: "increase" }
```

---

### 5. **Prisma Schema: `FredData` Model**

Database model for storing FRED observations.

```prisma
model FredData {
  id              String   @id @default(cuid())
  seriesId        String   // e.g., "RRPONTSYD", "WTREGEN"
  date            DateTime // Observation date
  value           Decimal  @db.Decimal(20, 2) // Value
  units           String   // e.g., "Billions of Dollars"
  realtimeStart   DateTime // When value was first recorded
  realtimeEnd     DateTime // When value was last updated
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@unique([seriesId, date])
  @@index([seriesId, date])
  @@index([date])
  @@index([seriesId])
}
```

**Indexes:**
- Unique constraint on `(seriesId, date)` - prevent duplicates
- Index on `(seriesId, date)` - fast range queries
- Index on `date` - time-based queries
- Index on `seriesId` - series-specific queries

---

### 6. **`src/lib/queries/fred.ts`**

Database query helpers for FRED data.

**Key Functions:**

#### `getLatestFredObservation(seriesId)`
```typescript
const latest = await getLatestFredObservation(FRED_SERIES.RRP);
if (latest) {
  console.log(`Latest RRP: $${latest.value}B on ${latest.date}`);
}
```

#### `getFredObservations(seriesId, startDate, endDate)`
```typescript
const observations = await getFredObservations(
  FRED_SERIES.TGA,
  new Date("2024-01-01"),
  new Date("2024-12-31")
);
```

#### `getRecentFredObservations(seriesId, days)`
```typescript
const last30Days = await getRecentFredObservations(FRED_SERIES.RRP, 30);
```

#### `getFredChangeOverPeriod(seriesId, days)`
```typescript
const change = await getFredChangeOverPeriod(FRED_SERIES.RRP, 7);
if (change) {
  console.log(`7D change: ${change.change.percent.toFixed(2)}%`);
  console.log(`Direction: ${change.change.direction}`);
}
```

#### `getFredStatistics(seriesId, days)`
```typescript
const stats = await getFredStatistics(FRED_SERIES.RRP, 30);
if (stats) {
  console.log(`Mean: ${stats.mean}`);
  console.log(`Range: ${stats.min} - ${stats.max}`);
  console.log(`Std Dev: ${stats.stdDev}`);
}
```

---

### 7. **`src/config/env.ts`** (Updated)

Added FRED_API_KEY to environment config.

```typescript
export const env = {
  // ... other keys
  FRED_API_KEY: process.env.FRED_API_KEY || "",
  // ...
} as const;
```

---

## Setup Instructions

### 1. Get a FRED API Key

1. Visit: https://fred.stlouisfed.org/docs/api/api_key.html
2. Create a free account (no credit card required)
3. Request an API key
4. Key is generated instantly

### 2. Configure Environment

Add to `.env.local`:

```bash
FRED_API_KEY="your_api_key_here"
```

### 3. Update Database Schema

```bash
npm run prisma:migrate:dev
# or
npx prisma migrate dev --name add_fred_data
```

This creates the `FredData` table.

### 4. Generate Prisma Client

```bash
npm run prisma:generate
```

---

## Usage Examples

### Example 1: Fetch and Store RRP Data

```typescript
import { fetchFredSeries } from "@/lib/data-sources/fred";
import { FRED_SERIES } from "@/lib/constants/fred-series";
import { toPrismaFormat } from "@/lib/normalization/fred";
import { prisma } from "@/lib/db";

async function backfillRRP() {
  // Fetch last 90 days of RRP data
  const result = await fetchFredSeries({
    seriesId: FRED_SERIES.RRP,
    startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
  });

  // Store in database
  for (const observation of result.observations) {
    const prismaData = toPrismaFormat(observation);
    await prisma.fredData.upsert({
      where: {
        seriesId_date: {
          seriesId: observation.seriesId,
          date: observation.date,
        },
      },
      create: prismaData,
      update: prismaData,
    });
  }

  console.log(`Stored ${result.observations.length} RRP observations`);
}
```

### Example 2: Calculate Liquidity Regime from FRED Data

```typescript
import { getLatestFredObservation, getFredChangeOverPeriod } from "@/lib/queries/fred";
import { FRED_SERIES } from "@/lib/constants/fred-series";

async function calculateLiquidityFromFRED() {
  // Get latest values
  const [latestRRP, latestTGA] = await Promise.all([
    getLatestFredObservation(FRED_SERIES.RRP),
    getLatestFredObservation(FRED_SERIES.TGA),
  ]);

  // Get 7-day changes
  const [rrpChange, tgaChange] = await Promise.all([
    getFredChangeOverPeriod(FRED_SERIES.RRP, 7),
    getFredChangeOverPeriod(FRED_SERIES.TGA, 7),
  ]);

  // Simple liquidity score logic
  // High RRP = more liquidity (positive)
  // High TGA = less liquidity (negative, liquidity drained)
  let liquidityScore = 0;

  if (rrpChange?.change.direction === "increase") {
    liquidityScore += 1; // More liquidity parked at Fed = high liquidity
  }

  if (tgaChange?.change.direction === "decrease") {
    liquidityScore += 1; // TGA declining = liquidity injected
  }

  const regime =
    liquidityScore >= 2
      ? "expansion"
      : liquidityScore === 1
        ? "neutral"
        : "contraction";

  console.log(`Liquidity Regime: ${regime}`);
  console.log(`RRP: $${latestRRP?.value}B (${rrpChange?.change.direction})`);
  console.log(`TGA: $${latestTGA?.value}M (${tgaChange?.change.direction})`);

  return { regime, liquidityScore, rrp: latestRRP, tga: latestTGA };
}
```

### Example 3: Create a Cron Job for FRED Data

```typescript
// src/app/api/cron/fetch-fred/route.ts
import { NextResponse } from "next/server";
import { fetchMultipleFredSeries } from "@/lib/data-sources/fred";
import { getAllFredSeriesIds } from "@/lib/constants/fred-series";
import { toPrismaFormat } from "@/lib/normalization/fred";
import { prisma } from "@/lib/db";
import { env } from "@/config/env";

export async function GET(request: Request) {
  // Verify cron secret in production
  if (env.IS_PRODUCTION) {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const seriesIds = getAllFredSeriesIds();
    
    // Fetch all series
    const results = await fetchMultipleFredSeries(seriesIds, {
      limit: 10, // Just fetch latest 10 observations
      sortOrder: "desc",
    });

    let totalInserted = 0;

    // Store each observation
    for (const result of results) {
      for (const observation of result.observations) {
        const prismaData = toPrismaFormat(observation);
        await prisma.fredData.upsert({
          where: {
            seriesId_date: {
              seriesId: observation.seriesId,
              date: observation.date,
            },
          },
          create: prismaData,
          update: prismaData,
        });
        totalInserted++;
      }
    }

    return NextResponse.json({
      success: true,
      inserted: totalInserted,
      series: results.length,
    });
  } catch (error) {
    console.error("FRED cron job failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch FRED data" },
      { status: 500 }
    );
  }
}
```

---

## FRED Series Details

### Reverse Repo (RRP)

**Series ID**: `RRPONTSYD`  
**Full Name**: Overnight Reverse Repurchase Agreements: Treasury Securities Sold by the Federal Reserve in the Temporary Open Market Operations  
**Frequency**: Daily, 7 days a week  
**Units**: Billions of Dollars  
**Seasonal Adjustment**: Not Seasonally Adjusted

**What It Means**:
- Amount of cash absorbed by the Fed through reverse repo operations
- High RRP = excess liquidity in the system (banks parking cash at Fed)
- Typically indicates high liquidity conditions
- Values above $2T are historically high

**Liquidity Signal**: ⬆️ RRP = ⬆️ Liquidity (Risk-On)

### Treasury General Account (TGA)

**Series ID**: `WTREGEN`  
**Full Name**: Treasury General Account  
**Frequency**: Weekly, ending Wednesday  
**Units**: Millions of Dollars  
**Seasonal Adjustment**: Not Seasonally Adjusted

**What It Means**:
- Cash balance held by U.S. Treasury at the Federal Reserve
- When TGA rises, money is taken out of the system (liquidity drain)
- When TGA falls, money flows into the system (liquidity injection)
- Typically ranges $50B - $800B

**Liquidity Signal**: ⬆️ TGA = ⬇️ Liquidity (Risk-Off)

---

## API Rate Limits

FRED API has generous rate limits:
- **120 requests per minute** (per API key)
- **10,000 requests per day** (per API key)

This is more than sufficient for a cron job that runs hourly or daily.

---

## What's NOT Included (By Design)

1. ❌ **Dashboard Integration** - No UI components or dashboard metrics yet
2. ❌ **Cron Jobs** - No automated fetching (example provided above)
3. ❌ **Advanced Regime Logic** - No composite liquidity regime calculation yet
4. ❌ **Backfill Scripts** - No historical data backfill (can be added easily)
5. ❌ **Data Visualization** - No charts for FRED data (future task)

---

## Next Steps (Future Tasks)

### Task 9: Integrate FRED Data into Dashboard
1. Create `FredMetricCard` component
2. Display RRP and TGA values
3. Show 7D changes
4. Add trend indicators

### Task 10: Advanced Liquidity Regime
1. Combine stablecoin + FRED data
2. Create composite liquidity score
3. Weight different indicators
4. Historical regime detection

### Task 11: FRED Data Visualization
1. Line chart for RRP over time
2. Line chart for TGA over time
3. Combined chart showing liquidity conditions
4. Correlation with BTC/crypto prices

### Task 12: Automated FRED Cron Job
1. Create `/api/cron/fetch-fred/route.ts`
2. Configure Vercel Cron (daily at 00:00 UTC)
3. Add error handling and retries
4. Send notifications on failures

---

## Testing

### Manual Test: Fetch Data

```bash
# In Node.js REPL or a test script
node --loader ts-node/esm
```

```typescript
import { fetchFredSeries } from "./src/lib/data-sources/fred.js";
import { FRED_SERIES } from "./src/lib/constants/fred-series.js";

const result = await fetchFredSeries({
  seriesId: FRED_SERIES.RRP,
  limit: 5,
  sortOrder: "desc",
});

console.log(result.observations);
```

### Manual Test: Query Database

```bash
# After storing some data
npm run prisma:studio
```

Navigate to `FredData` model and verify observations are stored correctly.

---

## Conclusion

The FRED API integration is **100% complete as a scaffold**:

✅ **Constants Layer** - Series IDs, metadata, helpers  
✅ **Types Layer** - Full TypeScript coverage  
✅ **Data Source Layer** - API client with error handling  
✅ **Normalization Layer** - Format conversion, utilities  
✅ **Persistence Layer** - Prisma schema, query helpers  
✅ **Documentation** - Complete usage guide

**Ready for**: Dashboard integration, cron jobs, liquidity regime calculation

**Not Included**: UI components, automated jobs (by design, per task requirements)

---

**Next**: Ready for TASK 9 (Dashboard FRED Integration) or continue with other features.
