-- CreateTable
CREATE TABLE "StablecoinSupply" (
    "id" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "supply" DECIMAL(30,2) NOT NULL,
    "marketCap" DECIMAL(30,2) NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "source" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StablecoinSupply_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExchangeFlow" (
    "id" TEXT NOT NULL,
    "exchange" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "flowType" TEXT NOT NULL,
    "amount" DECIMAL(30,2) NOT NULL,
    "amountUsd" DECIMAL(30,2) NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "source" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExchangeFlow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LiquidityRegime" (
    "id" TEXT NOT NULL,
    "regime" TEXT NOT NULL,
    "score" DECIMAL(10,4) NOT NULL,
    "supplyTrend" TEXT NOT NULL,
    "flowTrend" TEXT NOT NULL,
    "volatility" DECIMAL(10,4) NOT NULL,
    "confidence" DECIMAL(5,4) NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LiquidityRegime_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "StablecoinSupply_symbol_timestamp_idx" ON "StablecoinSupply"("symbol", "timestamp");

-- CreateIndex
CREATE INDEX "StablecoinSupply_timestamp_idx" ON "StablecoinSupply"("timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "StablecoinSupply_symbol_timestamp_key" ON "StablecoinSupply"("symbol", "timestamp");

-- CreateIndex
CREATE INDEX "ExchangeFlow_exchange_token_timestamp_idx" ON "ExchangeFlow"("exchange", "token", "timestamp");

-- CreateIndex
CREATE INDEX "ExchangeFlow_timestamp_idx" ON "ExchangeFlow"("timestamp");

-- CreateIndex
CREATE INDEX "LiquidityRegime_timestamp_idx" ON "LiquidityRegime"("timestamp");

-- CreateIndex
CREATE INDEX "LiquidityRegime_regime_timestamp_idx" ON "LiquidityRegime"("regime", "timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "LiquidityRegime_timestamp_key" ON "LiquidityRegime"("timestamp");
