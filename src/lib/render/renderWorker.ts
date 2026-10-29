import { processQueuedOrders } from './processQueuedOrders'

const POLL_INTERVAL_MS = Number(
  process.env.RENDER_POLL_INTERVAL_MS || '2000'
)

async function startWorker() {
  console.log(
    `Render worker started. Poll interval: ${POLL_INTERVAL_MS}ms`
  )

  while (true) {
    try {
      await processQueuedOrders(1)
    } catch (error) {
      console.error('Render worker cycle failed:', error)
    }

    await new Promise(resolve =>
      setTimeout(resolve, POLL_INTERVAL_MS)
    )
  }
}

startWorker().catch(error => {
  console.error('Render worker crashed:', error)
  process.exit(1)
})
