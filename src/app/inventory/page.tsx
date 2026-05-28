import { prisma } from "@/lib/prisma";
import InventoryClient from "@/components/InventoryClient";

interface Props {
  searchParams: Promise<{ status?: string }>;
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

  return <InventoryClient vehicles={vehicles} isSoldView={isSoldView} />;
}
