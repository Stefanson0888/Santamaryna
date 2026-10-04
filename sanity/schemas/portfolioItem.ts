export default {
  name: 'portfolioItem',
  title: 'Portfolio Item',
  type: 'document',

  fields: [
    {
      name: 'order',
      title: 'Order',
      type: 'number',
    },

    {
      name: 'titleEn',
      title: 'Title (EN)',
      type: 'string',
    },

    {
      name: 'titleUa',
      title: 'Title (UA)',
      type: 'string',
    },

    {
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      options: {
        source: 'titleEn',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },

    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'AI Images', value: 'ai-images' },
          { title: 'AI Video', value: 'ai-video' },
          { title: 'Ads', value: 'ads' },
          { title: 'Fashion', value: 'fashion' },
        ],
        layout: 'radio',
      },
    },

    {
      name: 'shortDescEn',
      title: 'Short Description (EN)',
      type: 'text',
      rows: 3,
    },

    {
      name: 'shortDescUa',
      title: 'Short Description (UA)',
      type: 'text',
      rows: 3,
    },

    {
      name: 'descriptionEn',
      title: 'Case Description (EN)',
      type: 'text',
      rows: 8,
    },

    {
      name: 'descriptionUa',
      title: 'Case Description (UA)',
      type: 'text',
      rows: 8,
    },

    {
      name: 'mediaType',
      title: 'Cover Media Type',
      type: 'string',
      options: {
        list: [
          { title: 'Image', value: 'image' },
          { title: 'Video URL', value: 'video' },
        ],
        layout: 'radio',
      },
    },

    {
      name: 'image',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt text',
        },
      ],
      hidden: ({ document }: any) => document?.mediaType === 'video',
    },

    {
      name: 'videoUrl',
      title: 'Video URL',
      type: 'url',
      hidden: ({ document }: any) => document?.mediaType !== 'video',
    },

    {
      name: 'gallery',
      title: 'Project Gallery',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alt text',
            },
          ],
        },
      ],
    },

    {
      name: 'tools',
      title: 'Tools Used',
      type: 'array',
      of: [{ type: 'string' }],
    },

    {
      name: 'year',
      title: 'Year',
      type: 'string',
    },

    {
      name: 'isActive',
      title: 'Show on site',
      type: 'boolean',
      initialValue: true,
    },
  ],

  preview: {
    select: {
      title: 'titleEn',
      media: 'image',
      category: 'category',
    },

    prepare: ({ title, media, category }: any) => ({
      title: title || 'Untitled',
      subtitle: category,
      media,
    }),
  },

  orderings: [
    {
      title: 'Manual order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
}
