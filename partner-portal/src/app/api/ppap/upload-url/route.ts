// src/app/api/ppap/upload-url/route.ts
import { createClient } from '@/lib/supabase/server';
import { getPortalUser } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { getPresignedUploadUrl, buildPPAPKey } from '@/lib/s3';
import { requireTier } from '@/lib/rbac';

const ALLOWED_TYPES: Record<string, string> = {
  'application/pdf': 'pdf',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
  'application/vnd.ms-excel': 'xls',
};

const MAX_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB

/**
 * POST /api/ppap/upload-url
 *
 * Body: { fileName: string; contentType: string; ppapLevel: number; sizeBytes: number }
 * Returns: { uploadUrl, s3Key, expiresAt }
 *
 * The client uses the uploadUrl to PUT directly to S3.
 * After the upload, the client calls POST /api/ppap to record the document metadata.
 */
export async function POST(req: NextRequest) {
  try {
    const user = await getPortalUser();
    if (!user) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });

    
    requireTier(user, 2);

    const body = await req.json();
    const { fileName, contentType, ppapLevel = 3, sizeBytes } = body;

    if (!fileName || !contentType) {
      return NextResponse.json({ error: 'fileName and contentType are required' }, { status: 400 });
    }

    if (!ALLOWED_TYPES[contentType]) {
      return NextResponse.json(
        { error: 'Only PDF and XLSX files are accepted for PPAP documents.' },
        { status: 415 },
      );
    }

    if (sizeBytes > MAX_SIZE_BYTES) {
      return NextResponse.json({ error: 'File exceeds the 50 MB limit.' }, { status: 413 });
    }

    const s3Key = buildPPAPKey(user.vendorId, ppapLevel, fileName);
    const result = await getPresignedUploadUrl('ppap', s3Key, contentType);

    return NextResponse.json({
      ...result,
      // Echo metadata back so the client can record it after upload
      meta: { vendorId: user.vendorId, ppapLevel, fileName, contentType, sizeBytes },
    });
  } catch (err) {
    console.error('[POST /api/ppap/upload-url]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}