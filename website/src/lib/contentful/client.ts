import { createClient, type ContentfulClientApi } from 'contentful'

// Validate required environment variables at import time
// This causes the build to fail loudly if configuration is missing
function requireEnv(key: string): string {
  const value = process.env[key]
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${key}\n` +
      `Copy .env.example to .env.local and populate all values.`
    )
  }
  return value
}

// Delivery client — used for all SSG/ISR page generation
// Read-only, safe to use in server components
let deliveryClient: ContentfulClientApi<undefined> | null = null

export function getDeliveryClient(): ContentfulClientApi<undefined> {
  if (!deliveryClient) {
    deliveryClient = createClient({
      space:       requireEnv('CONTENTFUL_SPACE_ID'),
      accessToken: requireEnv('CONTENTFUL_DELIVERY_TOKEN'),
      environment: process.env.CONTENTFUL_ENVIRONMENT ?? 'master',
    })
  }
  return deliveryClient
}

// Preview client — used for draft content in preview mode only
// Never expose the preview token to the client
let previewClient: ContentfulClientApi<undefined> | null = null

export function getPreviewClient(): ContentfulClientApi<undefined> {
  if (!previewClient) {
    previewClient = createClient({
      space:       requireEnv('CONTENTFUL_SPACE_ID'),
      accessToken: requireEnv('CONTENTFUL_PREVIEW_TOKEN'),
      environment: process.env.CONTENTFUL_ENVIRONMENT ?? 'master',
      host:        'preview.contentful.com',
    })
  }
  return previewClient
}

// Select the appropriate client based on preview mode
export function getClient(preview = false): ContentfulClientApi<undefined> {
  return preview ? getPreviewClient() : getDeliveryClient()
}
