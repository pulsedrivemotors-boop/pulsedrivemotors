import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail, buildLeadNotificationEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, phone, email, type, vehicle, date, time, message } = body

    // ── Validation ────────────────────────────────────────────────────────────
    if (!name?.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }
    if (!phone?.trim() && !email?.trim()) {
      return NextResponse.json({ error: 'Phone or email is required' }, { status: 400 })
    }

    // ── Build human-readable message ──────────────────────────────────────────
    let fullMessage: string | undefined
    if (type === 'testdrive') {
      const parts = []
      if (vehicle) parts.push(`Vehicle: ${vehicle}`)
      if (date) parts.push(`Date: ${date}`)
      if (time) parts.push(`Time: ${time}`)
      fullMessage = parts.join(' | ') || undefined
    } else {
      fullMessage = message?.trim() || undefined
    }

    // ── Save to database ──────────────────────────────────────────────────────
    const lead = await prisma.lead.create({
      data: {
        name: name.trim(),
        phone: phone?.trim() || null,
        email: email?.trim() || null,
        message: fullMessage || null,
        source: type === 'testdrive' ? 'testdrive' : 'website',
        vehicleInterest: vehicle?.trim() || null,
        status: 'new',
      },
    })

    // ── Send email notification (non-blocking) ────────────────────────────────
    const notifyEmail = process.env.NOTIFICATION_EMAIL || process.env.GMAIL_USER

    if (notifyEmail) {
      const subject =
        type === 'testdrive'
          ? `🚗 Новый тест-драйв: ${name.trim()}`
          : `💬 Новое сообщение: ${name.trim()}`

      const html = buildLeadNotificationEmail({
        name: name.trim(),
        phone: phone?.trim(),
        email: email?.trim(),
        source: type === 'testdrive' ? 'testdrive' : 'message',
        vehicle: vehicle?.trim(),
        date,
        time,
        message: message?.trim(),
      })

      // Fire-and-forget — don't fail the request if email fails
      sendEmail({ to: notifyEmail, subject, html }).catch((err) => {
        console.error('[contact] Email send failed:', err.message)
      })
    }

    return NextResponse.json({ success: true, leadId: lead.id }, { status: 201 })
  } catch (err) {
    console.error('[contact] Error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
