import type { RenderTemplate } from './types'

export const christmasSantaV1: RenderTemplate = {
  id: 'christmas-santa-v1',
  automationKey: 'christmas-santa-v1',
  name: 'Christmas Santa V1',

  masterVideo: 'christmas-santa-v1/master.mp4',

  width: 1920,
  height: 1080,
  fps: 30,
  duration: 35,

  layers: [
    {
      id: 'child-photo-frame',
      type: 'image',
      sourceKey: 'childPhoto',
      start: 8,
      duration: 5,
      x: 1180,
      y: 280,
      width: 420,
      height: 520,
      fit: 'cover',
    },

    {
      id: 'child-name',
      type: 'text',
      sourceKey: 'childName',
      start: 14,
      duration: 4,
      x: 680,
      y: 760,
      width: 560,
      height: 100,
    },

    {
      id: 'family-photo-1',
      type: 'image',
      sourceKey: 'importantPerson-1',
      start: 20,
      duration: 5,
      x: 390,
      y: 300,
      width: 460,
      height: 520,
      fit: 'cover',
    },

    {
      id: 'favorite-activity',
      type: 'text',
      sourceKey: 'favoriteActivity',
      start: 27,
      duration: 4,
      x: 640,
      y: 760,
      width: 640,
      height: 100,
    },
  ],
}
