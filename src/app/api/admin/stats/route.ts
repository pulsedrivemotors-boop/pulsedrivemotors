import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const [totalVehicles, availableVehicles, reservedVehicles, soldVehicles, totalLeads, newLeads, blogPosts, publishedPosts, recentLeads, importLogs] = await Promise.all([
    prisma.vehicle.count({ where: { deletedAt: null } }),
    prisma.vehicle.count({ where: { deletedAt: null, status: 'available' } }),
    prisma.vehicle.count({ where: { deletedAt: null, status: 'reserved' } }),
    prisma.vehicle.count({ where: { deletedAt: null, status: 'sold' } }),
    prisma.lead.count({ where: { deletedAt: null } }),
    prisma.lead.count({ where: { deletedAt: null, status: 'new' } }),
    prisma.blogPost.count(),
    prisma.blogPost.count({ where: { published: true } }),
    prisma.lead.findMany({ where: { deletedAt: null }, orderBy: { createdAt: 'desc' }, take: 8, include: { manager: { select: { name: true } } } }),
    prisma.importLog.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
  ])
  return NextResponse.json({ totalVehicles, availableVehicles, reservedVehicles, soldVehicles, totalLeads, newLeads, blogPosts, publishedPosts, recentLeads, importLogs })
}
