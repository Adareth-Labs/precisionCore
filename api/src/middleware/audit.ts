import type { Response, NextFunction } from 'express'
import type { AuthenticatedRequest } from '@/types'
import { auditService } from '@/services/audit/AuditService'

// Attach audit logging to mutating routes automatically
export function auditMiddleware(resourceType: string) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const originalJson = res.json.bind(res)
    res.json = (body: unknown) => {
      // Only log successful mutations
      if (res.statusCode < 400 && ['POST','PUT','PATCH','DELETE'].includes(req.method)) {
        const data = body as Record<string, unknown>
        auditService.log({
          action:       req.method === 'DELETE' ? 'DELETE' : req.method === 'POST' ? 'CREATE' : 'UPDATE',
          actorId:      req.auth?.sub ?? 'anonymous',
          actorEmail:   req.auth?.email ?? '',
          actorTier:    req.auth?.tier,
          ipAddress:    req.ip,
          userAgent:    req.headers['user-agent'],
          resourceType,
          resourceId:   (data?.data as Record<string,unknown>)?.id as string | undefined,
          supplierId:   req.auth?.supplierId,
          metadata:     { method: req.method, path: req.path, statusCode: res.statusCode },
        }).catch(() => { /* never block response for audit failures */ })
      }
      return originalJson(body)
    }
    next()
  }
}