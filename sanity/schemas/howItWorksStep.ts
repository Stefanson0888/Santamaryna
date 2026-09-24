export default {
  name: 'howItWorksStep', title: 'How It Works Step', type: 'document',
  fields: [
    { name: 'order', title: 'Step number', type: 'number' },
    { name: 'titleEn', title: 'Title (EN)', type: 'string' },
    { name: 'titleUa', title: 'Title (UA)', type: 'string' },
    { name: 'descEn', title: 'Description (EN)', type: 'text', rows: 2 },
    { name: 'descUa', title: 'Description (UA)', type: 'text', rows: 2 },
  ],
  preview: { select: { title: 'titleEn', order: 'order' },
    prepare: ({ title, order }: any) => ({ title: `Step ${order}: ${title}` }) },
  orderings: [{ title: 'Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
}
