import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const Solutions: CollectionConfig = {
  slug: 'solutions',
  labels: { singular: 'Solution', plural: 'Solutions' },
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'domain', 'status', 'updatedAt'],
    listSearchableFields: ['title', 'summary', 'domain'],
    preview: (doc) => `${process.env.NEXT_PUBLIC_SITE_URL}/solutions/${doc.slug}`,
  },
  access: { read: () => true },
  versions: { drafts: { autosave: { interval: 800 } } },
  fields: [
    // ── Identity ──────────────────────────────────────────────────────────────
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
      admin: { description: 'URL path segment — lowercase, hyphens only' },
    },
    {
      name: 'domain',
      type: 'select',
      required: true,
      options: [
        { label: 'Electric Vehicle',         value: 'EV' },
        { label: 'ADAS & Autonomy',          value: 'ADAS' },
        { label: 'Powertrain',               value: 'Powertrain' },
        { label: 'Thermal Management',       value: 'Thermal' },
        { label: 'Chassis & Safety',         value: 'Chassis' },
        { label: 'Connected Systems',        value: 'Connected' },
      ],
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
    // ── Content ───────────────────────────────────────────────────────────────
    {
      name: 'summary',
      type: 'textarea',
      required: true,
      admin: { description: 'One-paragraph teaser shown on the solutions listing page' },
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'body',
      type: 'richText',
      editor: lexicalEditor({}),
    },
    // ── Specs table ──────────────────────────────────────────────────────────
    {
      name: 'specs',
      type: 'array',
      label: 'Technical specifications',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
        { name: 'unit',  type: 'text' },
      ],
    },
    // ── SEO ───────────────────────────────────────────────────────────────────
    {
      name: 'seo',
      type: 'group',
      label: 'SEO',
      admin: { position: 'sidebar' },
      fields: [
        { name: 'title',       type: 'text',     label: 'Meta title' },
        { name: 'description', type: 'textarea',  label: 'Meta description', admin: { rows: 3 } },
        { name: 'ogImage',     type: 'upload',    label: 'OG image', relationTo: 'media' },
      ],
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc }) => {
        // Trigger Next.js ISR revalidation
        if (process.env.NEXT_PUBLIC_SITE_URL && process.env.REVALIDATION_SECRET) {
          await fetch(
            `${process.env.NEXT_PUBLIC_SITE_URL}/api/revalidate?secret=${process.env.REVALIDATION_SECRET}&tag=solutions`,
            { method: 'POST' }
          ).catch(console.error)
        }
        return doc
      },
    ],
  },
}
