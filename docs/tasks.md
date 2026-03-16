# Stablecoin Liquidity Monitor – Development Tasks

## Phase A – UI Foundation

### TASK 0
Define UI layout and sections
Status: Complete

### TASK 1
Create Next.js scaffold
Status: Complete

### TASK 2
Define design tokens
Status: Complete

### TASK 3
Create app shell layout
Status: Complete

### TASK 4
Create dashboard page skeleton
Status: Complete

---

## Phase B – Components

### TASK 5
Build MetricCard component
Status: In Progress / Complete if already implemented

- Reuse current dashboard design
- Ensure props are typed and reusable for real API-backed metrics
- Support label, value, delta, status, and optional helper text
- Do not redesign the component if already built; only refine if needed

### TASK 6
Build ChartPanel component
Status: In Progress / Complete if already implemented

- Reuse existing card/panel styling
- Support title, subtitle, actions, loading state, empty state, error state
- Prepare to host Recharts-based time series charts
- Do not leave this as a placeholder-only shell

---

## Phase C – Data Integration

### TASK 7
Replace mock data with first real stablecoin data pipeline

- Audit where dashboard mock data is currently hardcoded
- Implement DefiLlama stablecoin supply integration for USDT, USDC, and DAI
- Normalize external data into internal typed records
- Persist snapshots into PostgreSQL through Prisma
- Complete `/api/cron/fetch-stablecoins`
- Complete `/api/overview`
- Complete `/api/history`
- Replace dashboard mock data with real API responses
- Keep regime score and exchange flow as pending placeholders for now

### TASK 8
Integrate FRED API scaffold for macro liquidity inputs

- Add FRED client for future macro indicators
- Prepare support for:
  - Reverse Repo (RRP)
  - Treasury General Account (TGA)
- Keep this isolated from the dashboard if full integration is not yet ready
- Do not block stablecoin vertical slice on this task

---

## Phase D – Polish

### TASK 9
Improve UI spacing, hierarchy, and data clarity

- Refine spacing and typography only after real data is connected
- Improve metric hierarchy, timestamps, and formatting
- Add loading, empty, and error states where needed
- Keep current visual language and dark institutional style

### TASK 10
Refactor touched areas only

- Refactor only files changed during Tasks 5–9
- Remove obsolete mock-only logic where replaced
- Improve maintainability without broad restructuring
- Do not refactor the whole codebase