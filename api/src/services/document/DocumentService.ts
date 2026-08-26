import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { env } from '@/config/env'
import { auditService } from '@/services/audit/AuditService'
import type { PortalTier } from '@/types'
import { randomUUID } from 'crypto'

// Cloudflare R2 is S3-compatible — only differences are:
//   region: 'auto'  (R2 doesn't use AWS regions)
//   endpoint: your account's R2 endpoint
const s3 = new S3Client({
  region:      'auto',
  endpoint:    env.S3_ENDPOINT,
  credentials: { accessKeyId: env.AWS_ACCESS_KEY_ID, secretAccessKey: env.AWS_SECRET_ACCESS_KEY },
})

// Key structure: {resourceType}/{supplierId}/{resourceId}/{fileName}
// e.g. rfq/sup-123/rfq-456/drawing.pdf
// e.g. ppap/sup-123/ppap-789/control_plan.pdf
// e.g. certs/sup-123/iatf-cert.pdf

class DocumentService {
  buildKey(resourceType: string, supplierId: string, resourceId: string, fileName: string): string {
    const sanitized = fileName.replace(/[^a-zA-Z0-9._-]/g, '_')
    return `${resourceType}/${supplierId}/${resourceId}/${randomUUID()}_${sanitized}`
  }

  async getUploadUrl(
    key:         string,
    contentType: string,
    expiresIn:   number = 300 // 5 min upload window
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket:      env.S3_DOCUMENTS_BUCKET,
      Key:         key,
      ContentType: contentType,
    })
    return getSignedUrl(s3, command, { expiresIn })
  }

  async getDownloadUrl(
    key:       string,
    expiresIn: number = env.S3_PRESIGN_EXPIRY
  ): Promise<string> {
    const command = new GetObjectCommand({ Bucket: env.S3_DOCUMENTS_BUCKET, Key: key })
    return getSignedUrl(s3, command, { expiresIn })
  }

  async delete(key: string): Promise<void> {
    await s3.send(new DeleteObjectCommand({ Bucket: env.S3_DOCUMENTS_BUCKET, Key: key }))
  }

  // Log every document download for IATF 16949 compliance
  async auditDownload(params: {
    key:        string
    actorId:    string
    actorEmail: string
    actorTier:  PortalTier
    supplierId: string
    ipAddress:  string
  }): Promise<void> {
    await auditService.log({
      action:       'DOWNLOAD',
      actorId:      params.actorId,
      actorEmail:   params.actorEmail,
      actorTier:    params.actorTier,
      ipAddress:    params.ipAddress,
      resourceType: 'Document',
      resourceId:   params.key,
      supplierId:   params.supplierId,
      metadata:     { r2Key: params.key },
    })
  }
}

export const documentService = new DocumentService()
