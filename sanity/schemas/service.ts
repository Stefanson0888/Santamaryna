export default {
  name: 'service', title: 'Service', type: 'document',
  fields: [
    { name: 'order', title: 'Order', type: 'number' },
    { name: 'titleEn', title: 'Title (EN)', type: 'string' },
    { name: 'titleUa', title: 'Title (UA)', type: 'string' },
    { name: 'descEn', title: 'Description (EN)', type: 'text', rows: 3 },
    { name: 'descUa', title: 'Description (UA)', type: 'text', rows: 3 },
    { name: 'priceEn', title: 'Price label (EN)', type: 'string', description: 'e.g. From $150 / project' },
    { name: 'priceUa', title: 'Price label (UA)', type: 'string', description: 'e.g. Від $150 / проєкт' },
    { name: 'isActive', title: 'Show on site', type: 'boolean', initialValue: true },
  ],
  preview: { select: { title: 'titleEn', order: 'order' },
    prepare: ({ title, order }: any) => ({ title: `${order}. ${title}` }) },
  orderings: [{ title: 'Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
}
