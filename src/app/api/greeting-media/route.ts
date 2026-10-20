import { NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()

    const orderId = String(formData.get('orderId') || '')
    const fieldKey = String(formData.get('fieldKey') || '')
    const file = formData.get('file')

    if (!orderId || !fieldKey || !(file instanceof File)) {
      return NextResponse.json(
        { error: 'Missing upload information.' },
        { status: 400 }
      )
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Only image files are allowed.' },
        { status: 400 }
      )
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Image must be 10 MB or smaller.' },
        { status: 400 }
      )
    }

    const { data: order } = await supabaseAdmin
      .from('greeting_orders')
      .select('id, media')
      .eq('id', orderId)
      .single()

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found.' },
        { status: 404 }
      )
    }

    const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const safeFieldKey = fieldKey.replace(/[^a-zA-Z0-9_-]/g, '')
    const storagePath =
      `${orderId}/${safeFieldKey}-${randomUUID()}.${extension}`

    const buffer = Buffer.from(await file.arrayBuffer())

    const { error: uploadError } = await supabaseAdmin.storage
      .from('greeting-media')
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)

      return NextResponse.json(
        { error: 'Could not upload image.' },
        { status: 500 }
      )
    }

    const currentMedia =
      order.media && typeof order.media === 'object'
        ? order.media
        : {}

    const { error: updateError } = await supabaseAdmin
      .from('greeting_orders')
      .update({
        media: {
          ...currentMedia,
          [safeFieldKey]: storagePath,
        },
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId)

    if (updateError) {
      console.error('Order media update error:', updateError)

      return NextResponse.json(
        { error: 'Image uploaded, but order could not be updated.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      path: storagePath,
    })
  } catch (error) {
    console.error('Greeting media upload error:', error)

    return NextResponse.json(
      { error: 'Unexpected upload error.' },
      { status: 500 }
    )
  }
}
