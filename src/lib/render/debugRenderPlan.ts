import { buildRenderPlan } from './buildRenderPlan'

const testOrder = {
  id: 'test-order',
  automation_key: 'christmas-santa-v1',
  personalization: {
    childName: 'Emma',
    favoriteActivity: 'Drawing',
  },
  media: {
    childPhoto: 'test/child.jpg',
    'importantPerson-1': 'test/mom.jpg',
  },
}

console.log(
  JSON.stringify(
    buildRenderPlan(testOrder),
    null,
    2
  )
)
