import type { RenderTemplate } from './types'
import { christmasSantaV1 } from './christmasSantaV1'

const templates: RenderTemplate[] = [
  christmasSantaV1,
]

export function getRenderTemplate(
  automationKey: string
): RenderTemplate | null {
  return (
    templates.find(
      template => template.automationKey === automationKey
    ) || null
  )
}
