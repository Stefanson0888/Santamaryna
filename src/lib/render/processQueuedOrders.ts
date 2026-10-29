import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { loadEnvConfig } from '@next/env'

loadEnvConfig(process.cwd())

const execFileAsync = promisify(execFile)

export async function processQueuedOrders(limit = 1) {
  const { supabaseAdmin } = await import('../supabaseAdmin')

  const { data: orders, error } = await supabaseAdmin
    .from('greeting_orders')
    .select('id, payment_status, render_status')
    .eq('payment_status', 'paid')
    .eq('render_status', 'queued')
    .order('created_at', { ascending: true })
    .limit(limit)

  if (error) {
    throw error
  }

  if (!orders || orders.length === 0) {
    console.log('No queued paid orders found.')
    return
  }

  for (const order of orders) {
    console.log(`Processing order: ${order.id}`)

    const { error: updateToRenderingError } = await supabaseAdmin
      .from('greeting_orders')
      .update({
        render_status: 'rendering',
        updated_at: new Date().toISOString(),
      })
      .eq('id', order.id)

    if (updateToRenderingError) {
      console.error(`Could not mark order as rendering: ${order.id}`)
      console.error(updateToRenderingError)
      continue
    }

    try {
      await execFileAsync('npx', [
        'tsx',
        'src/lib/render/renderRealOrder.ts',
        order.id,
      ])

      console.log(`Finished order: ${order.id}`)
    } catch (renderError) {
      console.error(`Render failed for order: ${order.id}`)
      console.error(renderError)

      await supabaseAdmin
        .from('greeting_orders')
        .update({
          render_status: 'failed',
          updated_at: new Date().toISOString(),
        })
        .eq('id', order.id)
    }
  }
}

if (process.argv[1]?.endsWith('processQueuedOrders.ts')) {
  const limitArg = Number(process.argv[2] || '1')

  processQueuedOrders(limitArg).catch((error) => {
    console.error(error)
    process.exit(1)
  })
}
