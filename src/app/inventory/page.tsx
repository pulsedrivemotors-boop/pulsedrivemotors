import { prisma } from "@/lib/prisma";
import InventoryClient from "@/components/InventoryClient";

interface Props {
  searchParams: Promise<{ status?: string }>;
}

export const dynamic = "force-dynamic"; // Всегда рендерить свежие данные при загрузке страницы

export default async function InventoryPage({ searchParams }: Props) {
  const { status } = await searchParams;
  const isSoldView = status === "sold";

  const raw = await prisma.vehicle.findMany({
    where: {
      deletedAt: null,
      status: isSoldView ? "sold" : "available",
    },
    orderBy: { createdAt: "desc" },
  });

  // Parse JSON fields before passing to client
  const vehicles = raw.map(v => ({
    ...v,
    photos:   JSON.parse(v.photos   || "[]") as string[],
    features: JSON.parse(v.features || "[]") as string[],
  }));

  return <InventoryClient vehicles={vehicles} isSoldView={isSoldView} />;
}
