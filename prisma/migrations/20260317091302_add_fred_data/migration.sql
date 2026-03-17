-- CreateTable
CREATE TABLE "FredData" (
    "id" TEXT NOT NULL,
    "seriesId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "value" DECIMAL(20,2) NOT NULL,
    "units" TEXT NOT NULL,
    "realtimeStart" TIMESTAMP(3) NOT NULL,
    "realtimeEnd" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FredData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FredData_seriesId_date_idx" ON "FredData"("seriesId", "date");

-- CreateIndex
CREATE INDEX "FredData_date_idx" ON "FredData"("date");

-- CreateIndex
CREATE INDEX "FredData_seriesId_idx" ON "FredData"("seriesId");

-- CreateIndex
CREATE UNIQUE INDEX "FredData_seriesId_date_key" ON "FredData"("seriesId", "date");
