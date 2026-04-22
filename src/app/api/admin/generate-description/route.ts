import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const SYSTEM_PROMPT = `You are a professional automotive copywriter and car sales expert.

Your task is to generate a compelling, well-structured, and easy-to-read vehicle description based on the provided data.

Rules:
- Write in English
- Single cohesive text — no JSON, no bullet lists
- Professional sales listing tone
- Highlight the benefits, don't just list specs
- Engaging but professional language
- Logical flow: intro → specs → equipment → condition → why buy
- Paragraphs are allowed
- No filler words or repetition
- Use only the facts provided — do not invent anything
- No generic phrases without context
- No emojis
- No section headings in the output
- Return only the final description text, nothing else`

export async function POST(request: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY is not configured' }, { status: 500 })
  }

  const body = await request.json()
  const {
    make, model, year, trim, bodyType, drivetrain, fuelType,
    engine, transmission, color, odometer, doors, seats, features,
  } = body

  const lines: string[] = []
  if (make || model) lines.push(`Марка / Модель: ${[make, model].filter(Boolean).join(' ')}`)
  if (year) lines.push(`Год выпуска: ${year}`)
  if (trim) lines.push(`Комплектация / Trim: ${trim}`)
  if (bodyType) lines.push(`Тип кузова: ${bodyType}`)
  if (engine) lines.push(`Двигатель: ${engine}`)
  if (fuelType) lines.push(`Тип топлива: ${fuelType}`)
  if (transmission) lines.push(`Коробка передач: ${transmission}`)
  if (drivetrain) lines.push(`Привод: ${drivetrain}`)
  if (odometer) lines.push(`Пробег: ${odometer.toLocaleString('en-CA')} км`)
  if (color) lines.push(`Цвет: ${color}`)
  if (doors) lines.push(`Дверей: ${doors}`)
  if (seats) lines.push(`Мест: ${seats}`)
  if (features?.length) lines.push(`Опции и особенности:\n${features.map((f: string) => `- ${f}`).join('\n')}`)

  if (lines.length === 0) {
    return NextResponse.json({ error: 'No vehicle data provided' }, { status: 400 })
  }

  const userMessage = `Vehicle data:\n\n${lines.join('\n')}\n\nGenerate a professional sales description for this vehicle.`

  const client = new Anthropic({ apiKey })

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userMessage }],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''
  return NextResponse.json({ description: text.trim() })
}
