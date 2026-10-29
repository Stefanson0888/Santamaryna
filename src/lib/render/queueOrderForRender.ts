import { supabaseAdmin } from '../supabaseAdmin'

export async function queueOrderForRender(orderId: string) {
  const { data, error } = await supabaseAdmin
    .from('greeting_orders')
    .update({
      render_status: 'queued',
      updated_at: new Date().toISOString(),
    })
    .eq('id', orderId)
    .eq('payment_status', 'paid')
    .eq('render_status', 'waiting_payment')
    .select('id, automation_key, render_status')
    .maybeSingle()

  if (error) {
    throw new Error(`Could not queue render: ${error.message}`)
  }

  if (!data) {
    throw new Error(
      'Order was not queued. It may be unpaid or already queued/rendered.'
    )
  }

  return data
}
