import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { note } = await request.json()
  if (!note?.trim()) return NextResponse.json({ error: 'Note required' }, { status: 400 })
  const activity = await prisma.leadActivity.create({ data: { leadId: id, note } })
  return NextResponse.json(activity, { status: 201 })
}
