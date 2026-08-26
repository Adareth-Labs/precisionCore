import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

// Contentful webhook calls this endpoint after publishing
// Validates the shared secret before revalidating

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-contentful-webhook-secret')
  if (secret !== process.env.CONTENTFUL_WEBHOOK_SECRET) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const contentType = body?.sys?.contentType?.sys?.id as string | undefined

    const pathMap: Record<string, string[]> = {
      solution:          ['/solutions', '/solutions/[slug]'],
      innovationArticle: ['/innovation', '/innovation/[slug]'],
      newsArticle:       ['/', '/newsroom', '/newsroom/[slug]'],
      leadershipProfile: ['/company'],
      facility:          ['/company'],
      boardMember:       ['/governance'],
      siteMetrics:       ['/'],
    }

    const paths = pathMap[contentType ?? ''] ?? ['/']
    paths.forEach((p) => revalidatePath(p))

    return NextResponse.json({ revalidated: true, paths })
  } catch (err) {
    return NextResponse.json({ message: 'Revalidation failed', error: String(err) }, { status: 500 })
  }
}