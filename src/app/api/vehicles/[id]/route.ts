import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const vehicle = await prisma.vehicle.findFirst({
    where: { id, deletedAt: null },
  })
  if (!vehicle) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json({
    ...vehicle,
    photos: JSON.parse(vehicle.photos || '[]'),
    features: JSON.parse(vehicle.features || '[]'),
  })
}
