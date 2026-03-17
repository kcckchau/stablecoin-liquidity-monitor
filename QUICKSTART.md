# Quick Start Guide

## Prerequisites
- Node.js 18+
- PostgreSQL database
- pnpm or npm

## Setup (5 minutes)

### 1. Install Dependencies
```bash
npm install
npm install recharts  # Required for charts
```

### 2. Configure Environment
Create `.env` file:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/stablecoin_monitor"
NODE_ENV="development"
```

### 3. Setup Database
```bash
npm run prisma:generate
npm run prisma:migrate
```

### 4. Start Development Server
```bash
npm run dev
```

### 5. Fetch Initial Data
In a new terminal:
```bash
curl http://localhost:3000/api/cron/fetch-stablecoins
```

### 6. View Dashboard
Open: http://localhost:3000/dashboard

---

## API Endpoints

### Fetch Stablecoin Data
```bash
curl http://localhost:3000/api/cron/fetch-stablecoins
```

### Get Overview
```bash
curl http://localhost:3000/api/overview
```

### Get History
```bash
curl "http://localhost:3000/api/history?range=7D"
curl "http://localhost:3000/api/history?range=30D"
curl "http://localhost:3000/api/history?range=90D"
```

---

## Production Deployment (Vercel)

### 1. Set Environment Variables
```
DATABASE_URL=postgresql://...
CRON_SECRET=your-secret-here
NODE_ENV=production
```

### 2. Deploy
```bash
vercel deploy
```

### 3. Run Migration
```bash
npx prisma migrate deploy
```

Vercel Cron will automatically run `/api/cron/fetch-stablecoins` every hour.

---

## Troubleshooting

### "No Data Available" on Dashboard
Run the cron endpoint to fetch data:
```bash
curl http://localhost:3000/api/cron/fetch-stablecoins
```

### "Module '@prisma/client' has no exported member 'PrismaClient'"
Generate Prisma client:
```bash
npm run prisma:generate
```

### Database Connection Error
Check your `DATABASE_URL` in `.env` and ensure PostgreSQL is running.

---

## What's Working
✅ Real stablecoin supply data from DefiLlama  
✅ USDT, USDC, DAI tracking  
✅ Historical charts (30 days)  
✅ Liquidity regime calculation  
✅ API endpoints with proper DTOs  

## What's Pending
⏸️ Exchange flow data (requires CryptoQuant/Glassnode)  
⏸️ Advanced regime scoring  
⏸️ BTC/ETH price context  
⏸️ Chart timeframe switching (UI-only currently)  

---

For detailed documentation, see:
- `docs/TASK-7-FINAL.md` - Complete implementation report
- `docs/SETUP.md` - Detailed setup guide
- `README.md` - Project overview
