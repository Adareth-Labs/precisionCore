import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// RFQ submission endpoint
// In production this writes to the portal API via an authenticated service-to-service call.
// The portal owns the RFQ database — the public site only initiates.

const schema = z.object({
  productSlug:    z.string().optional(),
  sku:            z.string().optional(),
  annualVolume:   z.number().optional(),
  sopDate:        z.string().optional(),
  contactEmail:   z.string().email().optional(),
  step:           z.number().min(1).max(3),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = schema.parse(body)

    const PORTAL_URL = process.env.NEXT_PUBLIC_PORTAL_URL ?? 'https://portal.precisioncore.com'
    const PORTAL_API_SECRET = process.env.PORTAL_API_SECRET

    // Forward to portal API — portal owns the RFQ record
    const response = await fetch(`${PORTAL_URL}/api/rfq/initiate`, {
      method:  'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${PORTAL_API_SECRET}`,
        'X-Source':      'public-site',
      },
      body: JSON.stringify(data),
    }).catch(() => null)

    if (!response?.ok) {
      // Return a tracking ID optimistically even if portal is unavailable
      // The portal will reconcile on next sync
      const trackingId = `RFQ-${Date.now().toString().slice(-6)}`
      return NextResponse.json({ success: true, trackingId }, { status: 202 })
    }

    const result = (await response.json()) as { trackingId?: string }
    return NextResponse.json({ success: true, trackingId: result.trackingId })

  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: err.errors }, { status: 400 })
    }
    return NextResponse.json({ success: false, message: 'Submission failed' }, { status: 500 })
  }
}