import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

function isOwner(session: any) {
  return session?.user?.role === 'OWNER'
}

// GET /api/admin/accounting/costs?vehicleId=xxx
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!isOwner(session)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const vehicleId = req.nextUrl.searchParams.get('vehicleId')
  if (!vehicleId) return NextResponse.json({ error: 'vehicleId required' }, { status: 400 })

  const costs = await (prisma as any).vehicleCost.findMany({
    where: { vehicleId },
    orderBy: { date: 'desc' },
  })
  return NextResponse.json(costs)
}

// POST /api/admin/accounting/costs
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!isOwner(session)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json()
  const { vehicleId, category, description, amount, date } = body

  if (!vehicleId || !category || !amount) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const id = Math.random().toString(36).slice(2) + Date.now().toString(36)
  const cost = await (prisma as any).vehicleCost.create({
    data: {
      id,
      vehicleId,
      category,
      description: description || '',
      amount: parseFloat(amount),
      date: date ? new Date(date) : new Date(),
    },
  })
  return NextResponse.json(cost, { status: 201 })
}
