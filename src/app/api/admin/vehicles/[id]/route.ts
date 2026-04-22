import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const vehicle = await prisma.vehicle.findFirst({ where: { id, deletedAt: null } })
  if (!vehicle) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ ...vehicle, photos: JSON.parse(vehicle.photos || '[]'), features: JSON.parse(vehicle.features || '[]') })
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json()
  const { photos, features, ...rest } = body
  try {
    const vehicle = await prisma.vehicle.update({
      where: { id },
      data: { ...rest, photos: JSON.stringify(photos || []), features: JSON.stringify(features || []) },
    })
    return NextResponse.json({ ...vehicle, photos: JSON.parse(vehicle.photos), features: JSON.parse(vehicle.features) })
  } catch {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await prisma.vehicle.update({ where: { id }, data: { deletedAt: new Date() } })
  return NextResponse.json({ success: true })
}
