import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function getOrderForRender(orderId: string) {
  const { data: order, error } = await supabaseAdmin
    .from('greeting_orders')
    .select(`
      id,
      automation_key,
      personalization,
      media,
      payment_status,
      render_status
    `)
    .eq('id', orderId)
    .single()

  if (error || !order) {
    throw new Error(`Order not found: ${orderId}`)
  }

  return order
}
