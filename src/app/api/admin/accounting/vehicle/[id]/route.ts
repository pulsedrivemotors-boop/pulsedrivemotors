import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { VEHICLE_STATUSES } from '@/lib/vehicleStatus'

function isOwner(session: any) {
  return session?.user?.role === 'OWNER'
}

const VALID_STATUSES = VEHICLE_STATUSES.map(s => s.value as string)

// PATCH /api/admin/accounting/vehicle/[id]  — update purchasePrice / soldPrice
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!isOwner(session)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  const body = await req.json()

  const data: any = {}
  if (body.purchasePrice !== undefined) data.purchasePrice = body.purchasePrice === '' ? null : parseFloat(body.purchasePrice)
  if (body.soldPrice     !== undefined) data.soldPrice     = body.soldPrice     === '' ? null : parseFloat(body.soldPrice)
  if (body.purchaseDate  !== undefined) data.purchaseDate  = body.purchaseDate  === '' ? null : new Date(body.purchaseDate)
  if (body.soldDate      !== undefined) data.soldDate      = body.soldDate      === '' ? null : new Date(body.soldDate)

  // Status change propagates to the whole site (inventory, public pages, etc.)
  if (body.status !== undefined) {
    if (!VALID_STATUSES.includes(body.status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }
    data.status = body.status
    // Marking sold without an explicit sale date → default it to today so it
    // shows up in the accounting month filter.
    if (body.status === 'sold' && (data.soldDate === undefined || data.soldDate === null)) {
      data.soldDate = new Date()
    }
  }

  const vehicle = await prisma.vehicle.update({ where: { id }, data })
  return NextResponse.json(vehicle)
}

function daysBetween(a: Date | null, b: Date | null): number | null {
  if (!a || !b) return null
  const ms = b.getTime() - a.getTime()
  return Math.max(0, Math.round(ms / (1000 * 60 * 60 * 24)))
}

// GET /api/admin/accounting/vehicle/[id] — vehicle + costs + P&L
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!isOwner(session)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  const vehicle = await prisma.vehicle.findFirst({
    where: { id, deletedAt: null },
  })
  if (!vehicle) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const costs = await (prisma as any).vehicleCost.findMany({
    where: { vehicleId: id },
    orderBy: { date: 'desc' },
  })

  const totalCosts = costs.reduce((sum: number, c: any) => sum + c.amount, 0)
  const purchasePrice = (vehicle as any).purchasePrice ?? 0
  const soldPrice = (vehicle as any).soldPrice ?? null
  const purchaseDate = (vehicle as any).purchaseDate ?? null
  const soldDate = (vehicle as any).soldDate ?? null
  const totalInvested = purchasePrice + totalCosts
  const profit = soldPrice !== null ? soldPrice - totalInvested : null
  const profitPct = profit !== null && totalInvested > 0 ? (profit / totalInvested) * 100 : null
  const daysToSell = daysBetween(purchaseDate, soldDate)

  return NextResponse.json({
    vehicle: {
      ...vehicle,
      photos: JSON.parse(vehicle.photos || '[]'),
      features: JSON.parse(vehicle.features || '[]'),
      purchasePrice,
      soldPrice,
      purchaseDate,
      soldDate,
    },
    costs,
    summary: {
      purchasePrice,
      totalCosts,
      totalInvested,
      soldPrice,
      profit,
      profitPct,
      purchaseDate,
      soldDate,
      daysToSell,
    },
  })
}
