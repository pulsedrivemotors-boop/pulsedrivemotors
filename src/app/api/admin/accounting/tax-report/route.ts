import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

function isOwner(session: any) {
  return session?.user?.role === 'OWNER'
}

// GET /api/admin/accounting/tax-report
// Groups GST collected (on sales) and ITCs (GST paid on purchases + expenses) by calendar
// year, matching a GST/HST return filed annually. GST collected is attributed to the year a
// vehicle was sold; ITCs are attributed to the year the purchase/expense was incurred.
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!isOwner(session)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const vehicles = await prisma.vehicle.findMany({ where: { deletedAt: null } })
  const costs = await (prisma as any).vehicleCost.findMany({})

  const years = new Map<string, { gstCollected: number; itcPurchases: number; itcExpenses: number }>()
  const ensure = (year: string) => {
    if (!years.has(year)) years.set(year, { gstCollected: 0, itcPurchases: 0, itcExpenses: 0 })
    return years.get(year)!
  }

  for (const v of vehicles as any[]) {
    if (v.soldDate && v.saleTaxCollected) {
      const year = String(new Date(v.soldDate).getFullYear())
      ensure(year).gstCollected += v.saleTaxCollected
    }
    if (v.purchaseDate && v.purchaseTaxPaid) {
      const year = String(new Date(v.purchaseDate).getFullYear())
      ensure(year).itcPurchases += v.purchaseTaxPaid
    }
  }

  for (const c of costs as any[]) {
    if (c.date && c.taxPaid) {
      const year = String(new Date(c.date).getFullYear())
      ensure(year).itcExpenses += c.taxPaid
    }
  }

  const rows = Array.from(years.entries())
    .map(([year, v]) => {
      const totalItc = v.itcPurchases + v.itcExpenses
      return {
        year,
        gstCollected: v.gstCollected,
        itcPurchases: v.itcPurchases,
        itcExpenses: v.itcExpenses,
        totalItc,
        netRemittance: v.gstCollected - totalItc,
      }
    })
    .sort((a, b) => b.year.localeCompare(a.year))

  return NextResponse.json({ rows })
}
