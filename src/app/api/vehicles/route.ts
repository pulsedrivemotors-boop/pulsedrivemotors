import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const search = searchParams.get('search') || ''
  const make = searchParams.get('make') || ''
  const bodyType = searchParams.get('bodyType') || ''
  const fuelType = searchParams.get('fuelType') || ''
  const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined
  const maxOdometer = searchParams.get('maxOdometer') ? Number(searchParams.get('maxOdometer')) : undefined

  const status = searchParams.get('status') || 'available'

  const vehicles = await prisma.vehicle.findMany({
    where: {
      deletedAt: null,
      status,
      ...(search ? {
        OR: [
          { make: { contains: search } },
          { model: { contains: search } },
          { trim: { contains: search } },
          { vin: { contains: search } },
        ],
      } : {}),
      ...(make ? { make } : {}),
      ...(bodyType ? { bodyType } : {}),
      ...(fuelType ? { fuelType } : {}),
      ...(maxPrice !== undefined ? { price: { lte: maxPrice } } : {}),
      ...(maxOdometer !== undefined ? { odometer: { lte: maxOdometer } } : {}),
    },
    orderBy: { createdAt: 'desc' },
  })

  const parsed = vehicles.map(v => ({
    ...v,
    photos: JSON.parse(v.photos || '[]'),
    features: JSON.parse(v.features || '[]'),
  }))

  return NextResponse.json(parsed)
}
