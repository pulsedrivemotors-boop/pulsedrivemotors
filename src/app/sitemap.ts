import type { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

const SITE = 'https://pulsedrivemotors.ca'

// Rebuild the sitemap at most once an hour so new inventory/posts appear
// without hitting the DB on every crawl.
export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE}/`,          changeFrequency: 'daily',   priority: 1 },
    { url: `${SITE}/inventory`, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${SITE}/financing`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE}/trade-in`,  changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE}/contact`,   changeFrequency: 'yearly',  priority: 0.6 },
    { url: `${SITE}/blog`,      changeFrequency: 'weekly',  priority: 0.6 },
    { url: `${SITE}/privacy`,   changeFrequency: 'yearly',  priority: 0.2 },
    { url: `${SITE}/terms`,     changeFrequency: 'yearly',  priority: 0.2 },
  ]

  let vehiclePages: MetadataRoute.Sitemap = []
  let blogPages: MetadataRoute.Sitemap = []

  try {
    const vehicles = await prisma.vehicle.findMany({
      where: { deletedAt: null, status: { in: ['available', 'reserved'] } },
      select: { id: true, updatedAt: true },
      orderBy: { createdAt: 'desc' },
    })
    vehiclePages = vehicles.map(v => ({
      url: `${SITE}/inventory/${v.id}`,
      lastModified: v.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.8,
    }))

    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
      orderBy: { createdAt: 'desc' },
    })
    blogPages = posts.map(p => ({
      url: `${SITE}/blog/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: 'monthly',
      priority: 0.5,
    }))
  } catch {
    // If the DB is unreachable at build/request time, still serve the static URLs.
  }

  return [...staticPages, ...vehiclePages, ...blogPages]
}
