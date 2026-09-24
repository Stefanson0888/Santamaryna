import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { name, email, service, message } = await req.json()
    if (!name || !email || !message) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    // TODO: підключи Resend для реальних листів
    // const res = await fetch('https://api.resend.com/emails', {
    //   method: 'POST',
    //   headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     from: 'noreply@santamaryna.com',
    //     to: process.env.CONTACT_EMAIL,
    //     subject: `New message from ${name} — ${service}`,
    //     text: `From: ${name} <${email}>\nService: ${service}\n\n${message}`,
    //   }),
    // })

    console.log('📬 Contact form:', { name, email, service, message })
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
