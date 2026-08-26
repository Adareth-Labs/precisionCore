import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const News: CollectionConfig = {
  slug: 'news',
  labels: { singular: 'News item', plural: 'Newsroom' },
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'publishedAt', 'status'],
    preview: (doc) => `${process.env.NEXT_PUBLIC_SITE_URL}/newsroom/${doc.slug}`,
  },
  access: { read: () => true },
  versions: { drafts: { autosave: { interval: 800 } } },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'publishedAt',
      type: 'date',
      required: true,
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayAndTime' } },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft',     value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Press release',  value: 'press-release' },
        { label: 'Award',          value: 'award' },
        { label: 'Partnership',    value: 'partnership' },
        { label: 'Product update', value: 'product-update' },
        { label: 'Event',          value: 'event' },
      ],
    },
    {
      name: 'excerpt',
      type: 'textarea',
      required: true,
    },
    {
      name: 'body',
      type: 'richText',
      editor: lexicalEditor({}),
      admin: {
        description: 'Leave empty and set External URL if this item links out to a third-party article',
      },
    },
    {
      name: 'externalUrl',
      type: 'text',
      label: 'External URL',
      admin: {
        description: 'If set, "Read more" links to this URL instead of an internal article page',
      },
    },
    {
      name: 'seo',
      type: 'group',
      label: 'SEO',
      admin: { position: 'sidebar' },
      fields: [
        { name: 'title',       type: 'text',    label: 'Meta title' },
        { name: 'description', type: 'textarea', label: 'Meta description', admin: { rows: 3 } },
      ],
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc }) => {
        if (process.env.NEXT_PUBLIC_SITE_URL && process.env.REVALIDATION_SECRET) {
          await fetch(
            `${process.env.NEXT_PUBLIC_SITE_URL}/api/revalidate?secret=${process.env.REVALIDATION_SECRET}&tag=newsroom`,
            { method: 'POST' }
          ).catch(console.error)
        }
        return doc
      },
    ],
  },
}
