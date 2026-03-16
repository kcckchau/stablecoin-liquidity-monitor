# Setup Guide - Stablecoin Liquidity Monitor

## Prerequisites

- Node.js 18+
- PostgreSQL database
- pnpm (or npm)

## Initial Setup

### 1. Install Dependencies

```bash
pnpm install
# or
npm install
```

### 2. Environment Variables

Create a `.env` file in the project root:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/stablecoin_monitor"

# External API Keys (optional for development)
DEFILLAMA_API_KEY=""
CRYPTOQUANT_API_KEY=""
GLASSNODE_API_KEY=""

# Cron Secret (for production)
CRON_SECRET="your-secret-here"

# Environment
NODE_ENV="development"
```

### 3. Database Setup

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# (Optional) Open Prisma Studio to view database
npm run prisma:studio
```

### 4. Fetch Initial Data

The dashboard will show "No Data Available" until you fetch stablecoin data:

```bash
# Start dev server
npm run dev

# In another terminal, fetch data
curl http://localhost:3000/api/cron/fetch-stablecoins
```

Or use a REST client to send a GET request to `http://localhost:3000/api/cron/fetch-stablecoins`

### 5. View Dashboard

Open [http://localhost:3000/dashboard](http://localhost:3000/dashboard)

---

## Development Workflow

### Run Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
npm start
```

### Database Commands

```bash
# Generate Prisma Client (after schema changes)
npm run prisma:generate

# Create new migration
npm run prisma:migrate

# View database in browser
npm run prisma:studio
```

### Data Management

```bash
# Fetch current stablecoin data
curl http://localhost:3000/api/cron/fetch-stablecoins

# Backfill historical data (if scripts are implemented)
npm run backfill:stablecoins
npm run backfill:flows

# Seed database (if seed script is implemented)
npm run seed
```

---

## Common Issues

### Issue: `Module '@prisma/client' has no exported member 'PrismaClient'`

**Solution**: Generate Prisma Client
```bash
npm run prisma:generate
```

### Issue: Database connection errors

**Solution**: Check your `DATABASE_URL` in `.env`
- Ensure PostgreSQL is running
- Verify credentials are correct
- Test connection: `psql $DATABASE_URL`

### Issue: Empty dashboard

**Solution**: Fetch data from the cron endpoint
```bash
curl http://localhost:3000/api/cron/fetch-stablecoins
```

### Issue: Build fails with TypeScript errors

**Solution**: 
1. Ensure Prisma Client is generated: `npm run prisma:generate`
2. Check for syntax errors in modified files
3. Run `npm run lint` to see all errors

---

## Production Deployment (Vercel)

### 1. Database Setup

Use Vercel Postgres or external PostgreSQL provider:
- Create database
- Note the connection string

### 2. Environment Variables

Add to Vercel dashboard:
```
DATABASE_URL=postgresql://...
CRON_SECRET=your-secret-here
NODE_ENV=production
```

### 3. Build Configuration

Vercel should automatically:
- Run `prisma generate` (via postinstall hook if configured)
- Run `next build`

If needed, add to `package.json`:
```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

### 4. Run Migrations

```bash
# After first deploy
npx prisma migrate deploy
```

### 5. Cron Jobs

The cron configuration in `vercel.json` will automatically:
- Run `/api/cron/fetch-stablecoins` every hour
- Run `/api/cron/fetch-exchange-flows` every hour (when implemented)
- Run `/api/cron/compute-regime` every hour (when implemented)

---

## Testing the Setup

### 1. Check API Endpoints

```bash
# Get overview data
curl http://localhost:3000/api/overview

# Get history (last 30 days)
curl http://localhost:3000/api/history?days=30

# Get regime (when implemented)
curl http://localhost:3000/api/regime
```

### 2. Verify Database

```bash
# Open Prisma Studio
npm run prisma:studio

# Check if data exists in StablecoinSupply table
```

### 3. Check Logs

Look for console output like:
```
✓ Fetched 3 stablecoins from DefiLlama
✓ Successfully stored 3/3 stablecoin records in 234ms
✓ Total stablecoin supply: $142.50B
```

---

## Project Structure

```
stablecoin-liquidity-monitor/
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── migrations/             # Migration history
├── src/
│   ├── app/
│   │   ├── api/               # API routes
│   │   └── dashboard/         # Dashboard page
│   ├── components/            # React components
│   ├── lib/
│   │   ├── data-sources/      # External API integrations
│   │   ├── queries/           # Database queries
│   │   ├── normalization/     # Data transformation
│   │   └── regime-engine/     # Regime calculation
│   └── types/                 # TypeScript types
├── scripts/                   # Utility scripts
├── docs/                      # Documentation
└── .env                       # Environment variables (create this)
```

---

## Next Steps

After setup is complete:

1. ✅ Data pipeline is working
2. ⏭️ Integrate Recharts for visualizations
3. ⏭️ Add exchange flow data integration
4. ⏭️ Implement full regime scoring engine
5. ⏭️ Add real-time updates

---

## Getting Help

- **Documentation**: See `docs/` folder
- **API Docs**: Check individual route files in `src/app/api/`
- **Prisma Docs**: https://www.prisma.io/docs
- **Next.js Docs**: https://nextjs.org/docs

---

## Summary

Minimum steps to get started:

```bash
# 1. Install
pnpm install

# 2. Setup database
npm run prisma:generate
npm run prisma:migrate

# 3. Start dev server
npm run dev

# 4. Fetch data (in another terminal)
curl http://localhost:3000/api/cron/fetch-stablecoins

# 5. Open dashboard
open http://localhost:3000/dashboard
```

That's it! 🚀
