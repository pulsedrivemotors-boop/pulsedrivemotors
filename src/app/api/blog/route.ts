import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true, title: true, slug: true,
      excerpt: true, category: true,
      image: true, createdAt: true,
    },
  })
  return NextResponse.json(posts)
}
