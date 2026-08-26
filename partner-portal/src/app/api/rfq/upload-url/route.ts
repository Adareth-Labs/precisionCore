// src/app/api/rfq/upload-url/route.ts
import { createClient } from '@/lib/supabase/server';
import { getPortalUser } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { getPresignedUploadUrl, buildRFQKey } from '@/lib/s3';
import { requireTier } from '@/lib/rbac';

const ALLOWED_TYPES: Record<string, boolean> = {
  'application/pdf': true,
  'application/step': true,
  'model/step': true,
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': true,
  'image/vnd.dxf': true,
};

export async function POST(req: NextRequest) {
  try {
    const user = await getPortalUser();
    if (!user) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });

    
    requireTier(user, 2);

    const { fileName, contentType, rfqId, sizeBytes } = await req.json();
    if (!fileName || !contentType) {
      return NextResponse.json({ error: 'fileName and contentType required' }, { status: 400 });
    }
    if (sizeBytes > 25 * 1024 * 1024) {
      return NextResponse.json({ error: 'File exceeds 25 MB limit' }, { status: 413 });
    }

    const s3Key = buildRFQKey(user.vendorId, rfqId ?? 'pending', fileName);
    const result = await getPresignedUploadUrl('rfq', s3Key, contentType);

    return NextResponse.json(result);
  } catch (err) {
    console.error('[POST /api/rfq/upload-url]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}