export type RenderAssetType =
  | 'image'
  | 'text'
  | 'video'

export type RenderLayer = {
  id: string

  type: RenderAssetType

  // Key from order personalization/media.
  sourceKey: string

  // Timeline position in seconds.
  start: number
  duration: number

  // Position and size in final video.
  x: number
  y: number
  width: number
  height: number

  // Optional visual behaviour.
  fit?: 'cover' | 'contain'
  opacity?: number
  rotation?: number
}

export type RenderTemplate = {
  id: string

  // Must match greeting.automationKey.
  automationKey: string

  name: string

  // Path to pre-rendered master video.
  masterVideo: string

  width: number
  height: number
  fps: number

  layers: RenderLayer[]
}
