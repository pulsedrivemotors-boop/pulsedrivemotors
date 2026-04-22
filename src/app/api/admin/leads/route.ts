import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status') || ''
  const where: any = { deletedAt: null }
  if (status) where.status = status

  const leads = await prisma.lead.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { manager: { select: { id: true, name: true } } },
  })
  return NextResponse.json(leads)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const lead = await prisma.lead.create({ data: body })
  return NextResponse.json(lead, { status: 201 })
}
