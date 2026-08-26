import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://precisioncore.com'
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/api/', '/preview/'] },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  }
}