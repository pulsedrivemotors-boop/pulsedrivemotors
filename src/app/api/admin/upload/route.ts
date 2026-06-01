import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { mkdir } from 'fs/promises'
import path from 'path'
import sharp from 'sharp'

export async function POST(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await request.formData()
  const file = formData.get('file') as File
  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 })
  }

  if (file.size > 25 * 1024 * 1024) {
    return NextResponse.json({ error: 'File too large (max 25MB)' }, { status: 400 })
  }

  const bytes = await file.arrayBuffer()
  const inputBuffer = Buffer.from(bytes)

  // Convert to WebP: resize to max 1920px wide, quality 85
  const webpBuffer = await sharp(inputBuffer)
    .resize({ width: 1920, withoutEnlargement: true })
    .webp({ quality: 85 })
    .toBuffer()

  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.webp`

  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'vehicles')
  await mkdir(uploadDir, { recursive: true })

  const { writeFile } = await import('fs/promises')
  await writeFile(path.join(uploadDir, filename), webpBuffer)

  return NextResponse.json({ url: `/uploads/vehicles/${filename}` })
}
