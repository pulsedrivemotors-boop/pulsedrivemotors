-- Accounting: per-vehicle P&L tracking
-- Adds purchase/sale fields to Vehicle and a VehicleCost table for expenses.

ALTER TABLE "Vehicle" ADD COLUMN "purchasePrice" REAL;
ALTER TABLE "Vehicle" ADD COLUMN "soldPrice" REAL;
ALTER TABLE "Vehicle" ADD COLUMN "purchaseDate" DATETIME;
ALTER TABLE "Vehicle" ADD COLUMN "soldDate" DATETIME;

CREATE TABLE "VehicleCost" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "vehicleId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "amount" REAL NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "VehicleCost_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX "VehicleCost_vehicleId_idx" ON "VehicleCost"("vehicleId");
