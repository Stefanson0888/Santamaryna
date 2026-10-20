import { NextResponse } from 'next/server'
import { getGreetingBySlug } from '@/lib/queries'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const {
      productSlug,
      customerEmail,
      personalization,
      consent,
    } = body

    if (!productSlug || !customerEmail || !consent) {
      return NextResponse.json(
        { error: 'Missing required information.' },
        { status: 400 }
      )
    }

    const greeting = await getGreetingBySlug(productSlug)

    if (!greeting?.automationKey) {
      return NextResponse.json(
        { error: 'Greeting product not found.' },
        { status: 404 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('greeting_orders')
      .insert({
        product_slug: productSlug,
        automation_key: greeting.automationKey,
        customer_email: customerEmail,
        personalization: personalization || {},
        consent_at: new Date().toISOString(),
        payment_status: 'pending',
        render_status: 'waiting_payment',
      })
      .select('id')
      .single()

    if (error) {
      console.error('Supabase order error:', error)

      return NextResponse.json(
        { error: 'Could not create order.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      orderId: data.id,
    })
  } catch (error) {
    console.error('Create order error:', error)

    return NextResponse.json(
      { error: 'Unexpected server error.' },
      { status: 500 }
    )
  }
}
