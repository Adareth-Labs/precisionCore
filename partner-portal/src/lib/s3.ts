import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Cloudflare R2 — S3-compatible API with two differences from AWS S3:
//   region: 'auto'     (R2 has no regions)
//   endpoint: required (your account's R2 base URL from the dashboard)
// R2 encrypts all objects at rest by default — ServerSideEncryption header not needed.
const client = new S3Client({
  region: 'auto',
  endpoint: process.env.S3_ENDPOINT!,       // https://<ACCOUNT_ID>.r2.cloudflarestorage.com
  credentials: {
    accessKeyId:     process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const EXPIRY = parseInt(process.env.S3_PRESIGN_EXPIRY ?? '3600', 10);

export const BUCKETS = {
  rfq:  process.env.S3_BUCKET_RFQ  ?? 'rfq-docs',
  ppap: process.env.S3_BUCKET_PPAP ?? 'ppap-vault',
} as const;

export type BucketName = keyof typeof BUCKETS;

// ─── Key builders ─────────────────────────────────────────────────────────────

export function buildRFQKey(vendorId: string, rfqId: string, fileName: string): string {
  const safe = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  return `rfq-submissions/${vendorId}/${rfqId}/${Date.now()}-${safe}`;
}

export function buildPPAPKey(vendorId: string, ppapLevel: number, fileName: string): string {
  const safe = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  return `ppap/${vendorId}/level-${ppapLevel}/${Date.now()}-${safe}`;
}

// ─── Pre-signed URL generation ────────────────────────────────────────────────

/**
 * Generate a pre-signed PUT URL for direct browser-to-R2 upload.
 * The client uploads directly; the server never handles the file bytes.
 * Returns: { uploadUrl, s3Key, expiresAt }
 */
export async function getPresignedUploadUrl(
  bucket:      BucketName,
  key:         string,
  contentType: string,
): Promise<{ uploadUrl: string; s3Key: string; expiresAt: string }> {
  const command = new PutObjectCommand({
    Bucket:      BUCKETS[bucket],
    Key:         key,
    ContentType: contentType,
    Metadata:    { 'uploaded-via': 'partner-portal' },
  });

  const uploadUrl = await getSignedUrl(client, command, { expiresIn: 300 }); // 5-min upload window
  const expiresAt = new Date(Date.now() + 300 * 1000).toISOString();

  return { uploadUrl, s3Key: key, expiresAt };
}

/**
 * Generate a pre-signed GET URL for secure document download.
 */
export async function getPresignedDownloadUrl(
  bucket: BucketName,
  key:    string,
): Promise<string> {
  const command = new GetObjectCommand({ Bucket: BUCKETS[bucket], Key: key });
  return getSignedUrl(client, command, { expiresIn: EXPIRY });
}

/**
 * Check whether an object exists (e.g., to confirm upload completed).
 */
export async function objectExists(bucket: BucketName, key: string): Promise<boolean> {
  try {
    await client.send(new HeadObjectCommand({ Bucket: BUCKETS[bucket], Key: key }));
    return true;
  } catch {
    return false;
  }
}

/**
 * Delete an object (e.g., when a PPAP document is retracted).
 */
export async function deleteObject(bucket: BucketName, key: string): Promise<void> {
  await client.send(new DeleteObjectCommand({ Bucket: BUCKETS[bucket], Key: key }));
}
