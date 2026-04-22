import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const lead = await prisma.lead.findFirst({
    where: { id, deletedAt: null },
    include: { activities: { orderBy: { createdAt: 'desc' } }, manager: { select: { id: true, name: true } } },
  })
  if (!lead) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(lead)
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json()
  const lead = await prisma.lead.update({ where: { id }, data: body, include: { activities: true, manager: { select: { id: true, name: true } } } })
  return NextResponse.json(lead)
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await prisma.lead.update({ where: { id }, data: { deletedAt: new Date() } })
  return NextResponse.json({ success: true })
}
