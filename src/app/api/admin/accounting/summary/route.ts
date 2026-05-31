import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (session?.user && (session.user as any).role !== 'OWNER') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const vehicles = await prisma.vehicle.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: 'desc' },
  })

  const costs = await (prisma as any).vehicleCost.findMany({})

  const rows = vehicles.map((v: any) => {
    const vCosts = costs.filter((c: any) => c.vehicleId === v.id)
    const totalCosts = vCosts.reduce((s: number, c: any) => s + c.amount, 0)
    const purchasePrice = v.purchasePrice ?? 0
    const soldPrice = v.soldPrice ?? null
    const purchaseDate = v.purchaseDate ?? null
    const soldDate = v.soldDate ?? null
    const totalInvested = purchasePrice + totalCosts
    const profit = soldPrice !== null ? soldPrice - totalInvested : null
    const profitPct = profit !== null && totalInvested > 0 ? (profit / totalInvested) * 100 : null
    const daysToSell = purchaseDate && soldDate
      ? Math.max(0, Math.round((new Date(soldDate).getTime() - new Date(purchaseDate).getTime()) / 86400000))
      : null

    return {
      id: v.id,
      name: `${v.year} ${v.make} ${v.model}`,
      trim: v.trim,
      status: v.status,
      purchasePrice,
      totalCosts,
      totalInvested,
      soldPrice,
      listingPrice: v.price,
      profit,
      profitPct,
      purchaseDate,
      soldDate,
      daysToSell,
      costsCount: vCosts.length,
    }
  })

  // Overall stats
  const sold = rows.filter((r: any) => r.profit !== null)
  const totalProfit = sold.reduce((s: number, r: any) => s + r.profit, 0)
  const totalInvested = rows.reduce((s: number, r: any) => s + r.totalInvested, 0)
  const avgProfitPct = sold.length > 0
    ? sold.reduce((s: number, r: any) => s + (r.profitPct ?? 0), 0) / sold.length
    : 0

  return NextResponse.json({
    rows,
    stats: {
      totalVehicles: rows.length,
      soldCount: sold.length,
      totalProfit,
      totalInvested,
      avgProfitPct,
    },
  })
}
