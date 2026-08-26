import { Router } from 'express'
import { authenticate } from '@/middleware/auth'
import { requirePermission } from '@/middleware/rbac'
import { documentService } from '@/services/document/DocumentService'
import { downloadLimiter } from '@/middleware/rateLimit'
import type { AuthenticatedRequest } from '@/types'
import type { Request, Response } from 'express'

const router = Router()

// Static certificate documents — available to all authenticated partners
const CERT_KEYS: Record<string, string> = {
  'iatf-16949': 'certs/global/iatf-16949-2024.pdf',
  'iso-14001':  'certs/global/iso-14001-2024.pdf',
  'iso-45001':  'certs/global/iso-45001-2022.pdf',
}

router.get('/certs/:certId', authenticate, requirePermission('document:certs'), downloadLimiter, async (req: AuthenticatedRequest, res: Response) => {
  const key = CERT_KEYS[req.params.certId]
  if (!key) { res.status(404).json({ success: false, error: 'Certificate not found' }); return }

  const url = await documentService.getDownloadUrl(key)
  await documentService.auditDownload({
    key, actorId: req.auth.sub, actorEmail: req.auth.email,
    actorTier: req.auth.tier, supplierId: req.auth.supplierId, ipAddress: req.ip ?? '',
  })
  res.json({ success: true, data: { downloadUrl: url, expiresIn: 3600 } })
})

// CAD documents — QUALIFIED+ only
router.get('/cad/:key(*)', authenticate, requirePermission('document:cad'), downloadLimiter, async (req: AuthenticatedRequest, res: Response) => {
  const key = `cad/${req.params.key}`
  const url = await documentService.getDownloadUrl(key)
  await documentService.auditDownload({
    key, actorId: req.auth.sub, actorEmail: req.auth.email,
    actorTier: req.auth.tier, supplierId: req.auth.supplierId, ipAddress: req.ip ?? '',
  })
  res.json({ success: true, data: { downloadUrl: url, expiresIn: 3600 } })
})

// Technology roadmap — STRATEGIC only
router.get('/roadmap/:key(*)', authenticate, requirePermission('document:roadmap'), downloadLimiter, async (req: AuthenticatedRequest, res: Response) => {
  const key = `roadmap/${req.params.key}`
  const url = await documentService.getDownloadUrl(key)
  await documentService.auditDownload({
    key, actorId: req.auth.sub, actorEmail: req.auth.email,
    actorTier: req.auth.tier, supplierId: req.auth.supplierId, ipAddress: req.ip ?? '',
  })
  res.json({ success: true, data: { downloadUrl: url, expiresIn: 3600 } })
})

export default router