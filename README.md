# Stablecoin Liquidity Monitor

An MVP crypto liquidity intelligence dashboard built with Next.js 15, TypeScript, and Prisma.

## Architecture Overview

This is a full-stack Next.js application with a clear separation between client and server concerns:

- **Frontend**: React components in `src/components/` and `src/app/dashboard/`
- **Backend**: API routes in `src/app/api/` act as the boundary
- **Domain Logic**: Server-side only modules in `src/lib/` (especially `regime-engine/`)

### Key Principles

1. **Server-Side Regime Engine**: All scoring logic and regime computation happens server-side
2. **API Boundary**: Frontend only accesses data through API routes
3. **No Exposed Internals**: Rule weights and scoring algorithms are never sent to the client
4. **Placeholder Implementation**: This is a scaffold - business logic needs implementation

## Project Structure

```
stablecoin-liquidity-monitor/
├─ prisma/
│  └─ schema.prisma              # Database schema (PostgreSQL)
├─ scripts/
│  ├─ backfill-stablecoins.ts   # Historical data import for stablecoins
│  ├─ backfill-exchange-flows.ts # Historical data import for exchange flows
│  └─ seed.ts                    # Database seeding script
├─ src/
│  ├─ app/
│  │  ├─ dashboard/
│  │  │  └─ page.tsx             # Main dashboard UI
│  │  ├─ layout.tsx              # Root layout
│  │  ├─ page.tsx                # Home (redirects to dashboard)
│  │  ├─ globals.css             # Global styles
│  │  └─ api/
│  │     ├─ overview/            # Dashboard metrics endpoint
│  │     ├─ regime/              # Current regime endpoint
│  │     ├─ history/             # Historical data endpoint
│  │     └─ cron/                # Vercel cron endpoints
│  │        ├─ fetch-stablecoins/
│  │        ├─ fetch-exchange-flows/
│  │        └─ compute-regime/
│  ├─ components/
│  │  ├─ charts/
│  │  │  └─ liquidity-chart.tsx  # Chart component (placeholder)
│  │  ├─ cards/
│  │  │  ├─ regime-card.tsx      # Regime display card
│  │  │  └─ metric-card.tsx      # Metric display card
│  │  └─ signals/
│  │     └─ signal-summary.tsx   # Market signals component
│  ├─ lib/
│  │  ├─ data-sources/           # External API integrations
│  │  │  ├─ defillama.ts         # DefiLlama API client
│  │  │  └─ exchange-flows.ts    # Exchange flow data client
│  │  ├─ normalization/          # Data normalization functions
│  │  │  ├─ stablecoins.ts
│  │  │  └─ exchange-flows.ts
│  │  ├─ regime-engine/          # SERVER-ONLY: Regime computation
│  │  │  ├─ compute-regime.ts    # Main regime logic
│  │  │  └─ scoring.ts           # Scoring algorithms
│  │  ├─ db/
│  │  │  └─ prisma.ts            # Prisma client singleton
│  │  ├─ queries/                # Database query functions
│  │  │  ├─ overview.ts
│  │  │  ├─ history.ts
│  │  │  └─ regime.ts
│  │  ├─ utils/
│  │  │  ├─ dates.ts             # Date utilities
│  │  │  └─ numbers.ts           # Number formatting utilities
│  │  └─ constants/
│  │     └─ regime.ts            # Regime constants and thresholds
│  ├─ types/
│  │  ├─ api.ts                  # API response types
│  │  ├─ market-data.ts          # Market data types
│  │  └─ regime.ts               # Regime types
│  └─ config/
│     └─ env.ts                  # Environment configuration
└─ README.md
```

## Folder Responsibilities

### `src/app/`
Next.js 15 App Router pages and API routes. This is the entry point for both UI and API.

### `src/components/`
React components for the dashboard UI. All components are client-side.

### `src/lib/`
Core business logic and utilities:
- **data-sources/**: Fetch data from external APIs (DefiLlama, CryptoQuant, etc.)
- **normalization/**: Transform external data into consistent internal formats
- **regime-engine/**: **SERVER-ONLY** - Compute liquidity regimes and scores
- **queries/**: Database query functions using Prisma
- **utils/**: Shared utility functions
- **constants/**: Application constants

### `src/types/`
TypeScript type definitions shared across the application.

### `prisma/`
Database schema and migrations for PostgreSQL.

### `scripts/`
Standalone scripts for data operations:
- **seed.ts**: Seed initial database data
- **backfill-*.ts**: Import historical data

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- API keys for data sources (DefiLlama, CryptoQuant, Glassnode)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your database URL and API keys
   ```

4. Set up the database:
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```

5. (Optional) Seed the database:
   ```bash
   npm run seed
   ```

### Development

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

### Database Management

- Generate Prisma client: `npm run prisma:generate`
- Create migration: `npm run prisma:migrate`
- Open Prisma Studio: `npm run prisma:studio`

### Scripts

- Backfill stablecoin data: `npm run backfill:stablecoins`
- Backfill exchange flow data: `npm run backfill:flows`
- Seed database: `npm run seed`

## Deployment

This application is designed to deploy on Vercel:

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Configure cron jobs for:
   - `/api/cron/fetch-stablecoins` (every hour)
   - `/api/cron/fetch-exchange-flows` (every hour)
   - `/api/cron/compute-regime` (every hour, after data fetching)

### Vercel Cron Configuration

Add to `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cron/fetch-stablecoins",
      "schedule": "0 * * * *"
    },
    {
      "path": "/api/cron/fetch-exchange-flows",
      "schedule": "0 * * * *"
    },
    {
      "path": "/api/cron/compute-regime",
      "schedule": "15 * * * *"
    }
  ]
}
```

## TODO: Implementation Tasks

This is a **scaffold project** with placeholder implementations. Key areas that need real implementation:

### Data Sources (`src/lib/data-sources/`)
- [ ] Implement actual DefiLlama API integration
- [ ] Implement CryptoQuant/Glassnode API integration
- [ ] Add error handling and retry logic
- [ ] Implement rate limiting

### Database Queries (`src/lib/queries/`)
- [ ] Write actual Prisma queries for all placeholder functions
- [ ] Optimize queries for performance
- [ ] Add proper aggregations and time-windowing

### Regime Engine (`src/lib/regime-engine/`)
- [ ] Develop sophisticated scoring algorithms
- [ ] Tune weight values based on backtesting
- [ ] Implement advanced momentum calculations
- [ ] Add regime confidence scoring

### Frontend (`src/components/`)
- [ ] Integrate a charting library (Recharts, Chart.js)
- [ ] Add real-time data updates
- [ ] Improve responsive design
- [ ] Add loading states and error handling

### Cron Jobs (`src/app/api/cron/`)
- [ ] Complete database persistence logic
- [ ] Add job monitoring and alerting
- [ ] Implement incremental data fetching

### Testing
- [ ] Add unit tests for core logic
- [ ] Add integration tests for API routes
- [ ] Add E2E tests for dashboard

## Technologies

- **Next.js 15**: React framework with App Router
- **TypeScript**: Type safety
- **Prisma**: Database ORM
- **PostgreSQL**: Database
- **Tailwind CSS**: Styling
- **Vercel**: Deployment platform

## License

MIT
