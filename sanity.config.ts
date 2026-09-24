import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity/schemas'

export default defineConfig({
  name: 'santamaryna',
  title: 'SantaMaryna CMS',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  basePath: '/admin',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list().title('Content').items([
          S.listItem().title('⚙️  Site Settings')
            .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
          S.divider(),
          S.documentTypeListItem('portfolioItem').title('🖼  Portfolio'),
          S.documentTypeListItem('service').title('💼  Services'),
          S.documentTypeListItem('greeting').title('🎁  Video Greetings'),
          S.documentTypeListItem('howItWorksStep').title('📋  How It Works'),
        ]),
    }),
    visionTool(),
  ],
  schema: { types: schemaTypes },
})
