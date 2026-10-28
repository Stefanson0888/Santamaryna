import type { RenderLayer } from './types'

type OrderRenderData = {
  personalization?: Record<string, unknown> | null
  media?: Record<string, unknown> | null
}

export function resolveLayerSource(
  layer: RenderLayer,
  order: OrderRenderData
): string | null {
  if (layer.type === 'image' || layer.type === 'video') {
    const value = order.media?.[layer.sourceKey]

    return typeof value === 'string' && value.trim()
      ? value
      : null
  }

  if (layer.type === 'text') {
    const value = order.personalization?.[layer.sourceKey]

    if (typeof value === 'string' || typeof value === 'number') {
      return String(value)
    }

    return null
  }

  return null
}
