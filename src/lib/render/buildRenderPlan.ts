import { getRenderTemplate } from './templates'
import { resolveLayerSource } from './resolveLayerSource'

type OrderRenderData = {
  id: string
  automation_key: string
  personalization?: Record<string, unknown> | null
  media?: Record<string, unknown> | null
}

export function buildRenderPlan(order: OrderRenderData) {
  const template = getRenderTemplate(order.automation_key)

  if (!template) {
    throw new Error(
      `Render template not found for automation key: ${order.automation_key}`
    )
  }

  const layers = template.layers
    .map(layer => ({
      ...layer,
      source: resolveLayerSource(layer, order),
    }))
    .filter(layer => layer.source !== null)

  return {
    orderId: order.id,
    templateId: template.id,
    automationKey: template.automationKey,
    masterVideo: template.masterVideo,
    width: template.width,
    height: template.height,
    fps: template.fps,
    layers,
  }
}
