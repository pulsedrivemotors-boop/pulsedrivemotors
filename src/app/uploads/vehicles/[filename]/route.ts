import { readFile } from 'fs/promises'
import path from 'path'
import { NextResponse } from 'next/server'

const CONTENT_TYPES: Record<string, string> = {
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif':  'image/gif',
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params
  const filePath = path.join(process.cwd(), 'public', 'uploads', 'vehicles', filename)
  try {
    const file = await readFile(filePath)
    const ext = path.extname(filename).toLowerCase()
    const contentType = CONTENT_TYPES[ext] ?? 'application/octet-stream'
    return new NextResponse(file, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch {
    return new NextResponse('Not found', { status: 404 })
  }
}
