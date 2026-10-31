import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { renderOrder } from '@/lib/render/renderRealOrder'

export const runtime = 'nodejs'
export const maxDuration = 300

export async function POST(request: Request) {
  let orderId: string | null = null

  try {
    const expectedSecret = process.env.RENDER_API_SECRET
    const authorization = request.headers.get('authorization')

    if (
      !expectedSecret ||
      authorization !== `Bearer ${expectedSecret}`
    ) {
      return NextResponse.json(
        { error: 'Unauthorized.' },
        { status: 401 }
      )
    }

    const body = await request.json()
    orderId = body?.orderId

    if (!orderId || typeof orderId !== 'string') {
      return NextResponse.json(
        { error: 'orderId is required.' },
        { status: 400 }
      )
    }

    const { data: order, error } = await supabaseAdmin
      .from('greeting_orders')
      .select('id, payment_status, render_status')
      .eq('id', orderId)
      .single()

    if (error || !order) {
      return NextResponse.json(
        { error: 'Order not found.' },
        { status: 404 }
      )
    }

    if (
      order.payment_status !== 'paid' ||
      order.render_status !== 'queued'
    ) {
      return NextResponse.json(
        {
          error: 'Order is not ready for rendering.',
          paymentStatus: order.payment_status,
          renderStatus: order.render_status,
        },
        { status: 409 }
      )
    }

    await renderOrder(orderId)

    return NextResponse.json({
      success: true,
      orderId,
    })
  } catch (error) {
    console.error('Vercel render error:', error)

    if (orderId) {
      await supabaseAdmin
        .from('greeting_orders')
        .update({
          render_status: 'failed',
          updated_at: new Date().toISOString(),
        })
        .eq('id', orderId)
    }

    return NextResponse.json(
      { error: 'Render failed.' },
      { status: 500 }
    )
  }
}
