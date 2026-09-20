-- GST tracking: capture GST paid on purchase (ITC) and GST collected on sale per vehicle,
-- plus GST paid on individual expense line items, so tax reports can be generated per period.

ALTER TABLE "Vehicle" ADD COLUMN "purchaseTaxPaid" REAL;
ALTER TABLE "Vehicle" ADD COLUMN "saleTaxCollected" REAL;

ALTER TABLE "VehicleCost" ADD COLUMN "taxPaid" REAL NOT NULL DEFAULT 0;
