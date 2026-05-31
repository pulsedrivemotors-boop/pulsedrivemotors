import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

function isOwner(session: any) {
  return session?.user?.role === 'OWNER'
}

// DELETE /api/admin/accounting/costs/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!isOwner(session)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  await (prisma as any).vehicleCost.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
