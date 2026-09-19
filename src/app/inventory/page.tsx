import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import InventoryClient from "@/components/InventoryClient";

interface Props {
  searchParams: Promise<{ status?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { status } = await searchParams;
  const isSold = status === "sold";
  if (isSold) {
    // The sold listing is a filtered, low-value view — keep it crawlable but
    // out of the index so it doesn't compete with the main inventory page.
    return {
      title: "Recently Sold Vehicles | Pulse Drive Motors Calgary",
      description: "Recently sold certified pre-owned vehicles at Pulse Drive Motors — your used car dealer in Calgary, Alberta.",
      robots: { index: false, follow: true },
    };
  }
  return {
    title: "Used Cars, SUVs & Trucks for Sale in Calgary, AB | Pulse Drive Motors",
    description: "Browse our full inventory of certified pre-owned cars, SUVs and trucks for sale in Calgary, Alberta. Transparent pricing, CARFAX reports and flexible financing.",
    alternates: { canonical: "/inventory" },
  };
}

export const dynamic = "force-dynamic"; // Всегда рендерить свежие данные при загрузке страницы

export default async function InventoryPage({ searchParams }: Props) {
  const { status } = await searchParams;
  const isSoldView = status === "sold";

  type VehicleRow = Awaited<ReturnType<typeof prisma.vehicle.findMany>>[number];
  let vehicles: Array<Omit<VehicleRow, "photos" | "features"> & {
    photos: string[];
    features: string[];
  }> = [];

  try {
    const raw = await prisma.vehicle.findMany({
      where: {
        deletedAt: null,
        status: isSoldView ? "sold" : "available",
      },
      orderBy: { createdAt: "desc" },
    });

    vehicles = raw.map(v => ({
      ...v,
      photos:   JSON.parse(v.photos   || "[]") as string[],
      features: JSON.parse(v.features || "[]") as string[],
    }));
  } catch (err) {
    console.error('[InventoryPage] DB query failed, rendering empty list:', err);
  }

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": isSoldView ? "Recently Sold Vehicles" : "Used Vehicles for Sale in Calgary",
    "numberOfItems": vehicles.length,
    "itemListElement": vehicles.map((v, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "url": `https://pulsedrivemotors.ca/inventory/${v.id}`,
      "name": `${v.year} ${v.make} ${v.model}${v.trim ? " " + v.trim : ""}`.trim(),
    })),
  };

  return (
    <>
      {vehicles.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
        />
      )}
      <InventoryClient vehicles={vehicles} isSoldView={isSoldView} />
    </>
  );
}
