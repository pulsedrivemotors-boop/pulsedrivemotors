import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import Papa from 'papaparse'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { csvText, fileName } = body

  if (!csvText) return NextResponse.json({ error: 'No CSV data' }, { status: 400 })

  const result = Papa.parse(csvText, { header: true, skipEmptyLines: true, transformHeader: (h: string) => h.trim() })
  const rows = result.data as any[]

  if (rows.length === 0) return NextResponse.json({ error: 'No rows found' }, { status: 400 })

  const preview = body.preview
  if (preview) return NextResponse.json({ preview: rows.slice(0, 5), total: rows.length })

  let count = 0
  const errors: string[] = []

  for (const row of rows) {
    try {
      if (!row.vin || !row.make || !row.model) { errors.push(`Row missing required fields: ${JSON.stringify(row)}`); continue }
      await prisma.vehicle.upsert({
        where: { vin: row.vin.trim() },
        update: {
          make: row.make, model: row.model, year: parseInt(row.year) || 2020,
          trim: row.trim || '', bodyType: row.bodyType || '', drivetrain: row.drivetrain || '',
          fuelType: row.fuelType || 'Gasoline', odometer: parseInt(row.odometer) || 0,
          price: parseFloat(row.price) || 0, description: row.description || '',
          status: row.status || 'available', engine: row.engine || '', transmission: row.transmission || '',
          color: row.color || '', doors: parseInt(row.doors) || 4, seats: parseInt(row.seats) || 5,
          photos: JSON.stringify(row.photos ? [row.photos] : []),
          features: JSON.stringify(row.features ? row.features.split(',').map((f: string) => f.trim()) : []),
        },
        create: {
          vin: row.vin.trim(), make: row.make, model: row.model, year: parseInt(row.year) || 2020,
          trim: row.trim || '', bodyType: row.bodyType || '', drivetrain: row.drivetrain || '',
          fuelType: row.fuelType || 'Gasoline', odometer: parseInt(row.odometer) || 0,
          price: parseFloat(row.price) || 0, description: row.description || '',
          status: row.status || 'available', engine: row.engine || '', transmission: row.transmission || '',
          color: row.color || '', doors: parseInt(row.doors) || 4, seats: parseInt(row.seats) || 5,
          photos: JSON.stringify(row.photos ? [row.photos] : []),
          features: JSON.stringify(row.features ? row.features.split(',').map((f: string) => f.trim()) : []),
        },
      })
      count++
    } catch (e: any) {
      errors.push(`Error on VIN ${row.vin}: ${e.message}`)
    }
  }

  await prisma.importLog.create({ data: { fileName: fileName || 'import.csv', fileType: 'csv', success: errors.length === 0, message: errors.slice(0, 3).join('; ') || null, count } })

  return NextResponse.json({ success: true, count, errors: errors.slice(0, 5) })
}
