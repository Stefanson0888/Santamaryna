import { loadEnvConfig } from '@next/env'

loadEnvConfig(process.cwd())

async function main() {
  const orderId = process.argv[2]

  if (!orderId) {
    throw new Error('Please provide an order ID.')
  }

  const { getOrderForRender } = await import('./getOrderForRender')

  const order = await getOrderForRender(orderId)

  console.log(JSON.stringify(order, null, 2))
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
