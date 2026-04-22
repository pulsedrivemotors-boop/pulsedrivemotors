import * as tls from 'tls'

interface SendEmailOptions {
  to: string
  subject: string
  html: string
}

function write(socket: tls.TLSSocket, data: string) {
  socket.write(data + '\r\n')
}

/**
 * Minimal SMTP client using Gmail SSL (port 465).
 * Requires GMAIL_USER and GMAIL_APP_PASSWORD env vars.
 */
export async function sendEmail({ to, subject, html }: SendEmailOptions): Promise<void> {
  const user = process.env.GMAIL_USER
  const pass = process.env.GMAIL_APP_PASSWORD

  if (!user || !pass) {
    console.warn('[email] GMAIL_USER or GMAIL_APP_PASSWORD not set — skipping email')
    return
  }

  return new Promise((resolve, reject) => {
    const socket = tls.connect({
      host: 'smtp.gmail.com',
      port: 465,
      servername: 'smtp.gmail.com',
    })

    socket.setTimeout(20000)
    socket.on('timeout', () => { socket.destroy(); reject(new Error('SMTP timeout')) })
    socket.on('error', reject)

    let step = 0
    let buf = ''

    socket.on('data', (chunk) => {
      buf += chunk.toString()
      const lines = buf.split('\r\n')
      buf = lines.pop() ?? ''

      for (const line of lines) {
        if (!line) continue
        const code = parseInt(line.slice(0, 3), 10)
        const isFinal = line[3] === ' ' || line.length === 3

        // Collect multi-line responses — only act on the final line
        if (!isFinal) continue

        if (code >= 400) {
          socket.destroy()
          return reject(new Error(`SMTP ${code}: ${line.slice(4)}`))
        }

        switch (step) {
          case 0: // 220 greeting
            step = 1
            write(socket, 'EHLO localhost')
            break

          case 1: // 250 EHLO capabilities
            step = 2
            write(socket, 'AUTH LOGIN')
            break

          case 2: // 334 Username prompt
            step = 3
            write(socket, Buffer.from(user).toString('base64'))
            break

          case 3: // 334 Password prompt
            step = 4
            write(socket, Buffer.from(pass).toString('base64'))
            break

          case 4: // 235 authenticated
            step = 5
            write(socket, `MAIL FROM:<${user}>`)
            break

          case 5: // 250 MAIL FROM ok
            step = 6
            write(socket, `RCPT TO:<${to}>`)
            break

          case 6: // 250 RCPT TO ok
            step = 7
            write(socket, 'DATA')
            break

          case 7: // 354 start input
            step = 8
            // Dot-stuff lines starting with '.' (RFC 5321)
            const body = html.replace(/^\./gm, '..')
            const message = [
              `From: Pulse Drive Motors <${user}>`,
              `To: ${to}`,
              `Subject: ${subject}`,
              'MIME-Version: 1.0',
              'Content-Type: text/html; charset=UTF-8',
              `Date: ${new Date().toUTCString()}`,
              '',
              body,
              '.',
            ].join('\r\n')
            socket.write(message + '\r\n')
            break

          case 8: // 250 message accepted
            step = 9
            write(socket, 'QUIT')
            break

          case 9: // 221 bye
            socket.destroy()
            resolve()
            break
        }
      }
    })
  })
}

// ─── Email templates ──────────────────────────────────────────────────────────

export function buildLeadNotificationEmail(data: {
  name: string
  phone?: string
  email?: string
  source: 'testdrive' | 'message'
  vehicle?: string
  date?: string
  time?: string
  message?: string
}): string {
  const sourceLabel = data.source === 'testdrive' ? '🚗 Запись на тест-драйв' : '💬 Сообщение с сайта'
  const rows = [
    ['Имя', data.name],
    ['Телефон', data.phone || '—'],
    ['Email', data.email || '—'],
    data.vehicle ? ['Автомобиль', data.vehicle] : null,
    data.date ? ['Дата тест-драйва', data.date] : null,
    data.time ? ['Время', data.time] : null,
    data.message ? ['Сообщение', data.message] : null,
  ].filter(Boolean) as [string, string][]

  const tableRows = rows
    .map(
      ([label, value]) => `
      <tr>
        <td style="padding:10px 14px;color:#9ca3af;font-size:13px;white-space:nowrap;border-bottom:1px solid #1f2937;">${label}</td>
        <td style="padding:10px 14px;color:#f9fafb;font-size:13px;border-bottom:1px solid #1f2937;">${value}</td>
      </tr>`
    )
    .join('')

  return `<!DOCTYPE html>
<html lang="ru">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:560px;margin:32px auto;padding:0 16px;">

    <!-- Header -->
    <div style="background:#111827;border:1px solid rgba(132,204,22,0.3);border-radius:12px 12px 0 0;padding:24px 28px;text-align:center;">
      <div style="display:inline-flex;align-items:center;gap:10px;background:rgba(132,204,22,0.08);border:1px solid rgba(132,204,22,0.25);border-radius:100px;padding:6px 16px;margin-bottom:12px;">
        <svg width="40" height="16" viewBox="0 0 200 60" fill="none">
          <polyline points="0,30 30,30 50,5 65,55 80,10 95,50 110,30 200,30"
            fill="none" stroke="#84cc16" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span style="color:#84cc16;font-size:11px;font-weight:600;letter-spacing:2px;">PULSE DRIVE MOTORS</span>
      </div>
      <h1 style="margin:0;color:#f9fafb;font-size:20px;font-weight:700;">${sourceLabel}</h1>
      <p style="margin:6px 0 0;color:#6b7280;font-size:13px;">Новый лид на сайте — требует обработки</p>
    </div>

    <!-- Body -->
    <div style="background:#111827;border-left:1px solid rgba(132,204,22,0.3);border-right:1px solid rgba(132,204,22,0.3);padding:0 28px 24px;">
      <table style="width:100%;border-collapse:collapse;margin-top:16px;background:#0d1117;border-radius:8px;overflow:hidden;">
        ${tableRows}
      </table>
    </div>

    <!-- Footer -->
    <div style="background:#0d1117;border:1px solid rgba(255,255,255,0.06);border-top:none;border-radius:0 0 12px 12px;padding:16px 28px;text-align:center;">
      <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3001'}/admin/leads"
        style="display:inline-block;background:#84cc16;color:#000;font-weight:700;font-size:13px;padding:10px 24px;border-radius:8px;text-decoration:none;">
        Открыть в Админке →
      </a>
      <p style="margin:12px 0 0;color:#4b5563;font-size:11px;">Pulse Drive Motors · pulsedrivemotors.ca</p>
    </div>

  </div>
</body>
</html>`
}
