import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const search = searchParams.get('search') || ''
  const status = searchParams.get('status') || ''
  const skip = (page - 1) * limit

  const where: any = { deletedAt: null }
  if (status) where.status = status
  if (search) {
    where.OR = [
      { make: { contains: search } },
      { model: { contains: search } },
      { vin: { contains: search } },
    ]
  }

  const [vehicles, total] = await Promise.all([
    prisma.vehicle.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
    prisma.vehicle.count({ where }),
  ])

  const parsed = vehicles.map(v => ({
    ...v,
    photos: JSON.parse(v.photos || '[]'),
    features: JSON.parse(v.features || '[]'),
  }))

  return NextResponse.json({ vehicles: parsed, total, page, pages: Math.ceil(total / limit) })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { photos, features, ...rest } = body

  try {
    const vehicle = await prisma.vehicle.create({
      data: {
        ...rest,
        photos: JSON.stringify(photos || []),
        features: JSON.stringify(features || []),
      },
    })
    return NextResponse.json({ ...vehicle, photos: JSON.parse(vehicle.photos), features: JSON.parse(vehicle.features) }, { status: 201 })
  } catch (error: any) {
    if (error.code === 'P2002') return NextResponse.json({ error: 'VIN already exists' }, { status: 400 })
    return NextResponse.json({ error: 'Failed to create vehicle' }, { status: 500 })
  }
}
