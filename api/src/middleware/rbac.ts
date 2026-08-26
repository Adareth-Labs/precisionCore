import type { Response, NextFunction } from 'express'
import type { PortalTier } from '@/types'
import type { AuthenticatedRequest } from '@/types'
import { TIER_PERMISSIONS } from '@/types'
import { auditService } from '@/services/audit/AuditService'

const TIER_RANK: Record<PortalTier, number> = { BASIC: 1, QUALIFIED: 2, STRATEGIC: 3 }

// Require a minimum tier level
export function requireTier(minTier: PortalTier) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const userRank    = TIER_RANK[req.auth.tier]
    const requiredRank = TIER_RANK[minTier]
    if (userRank >= requiredRank) { next(); return }

    auditService.log({
      action:       'ACCESS_DENIED',
      actorId:      req.auth.sub,
      actorEmail:   req.auth.email,
      actorTier:    req.auth.tier,
      ipAddress:    req.ip,
      userAgent:    req.headers['user-agent'],
      resourceType: 'Route',
      resourceId:   req.path,
      metadata:     { requiredTier: minTier, userTier: req.auth.tier },
    })

    res.status(403).json({
      success: false,
      error:   `This resource requires ${minTier} access. Your current tier is ${req.auth.tier}.`,
    })
  }
}

// Require a specific permission from the permission matrix
export function requirePermission(permission: string) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const allowed = TIER_PERMISSIONS[permission] ?? []
    if (allowed.includes(req.auth.tier)) { next(); return }

    auditService.log({
      action:       'ACCESS_DENIED',
      actorId:      req.auth.sub,
      actorEmail:   req.auth.email,
      actorTier:    req.auth.tier,
      ipAddress:    req.ip,
      userAgent:    req.headers['user-agent'],
      resourceType: 'Permission',
      resourceId:   permission,
    })

    res.status(403).json({
      success: false,
      error:   `Permission '${permission}' is not available for tier ${req.auth.tier}.`,
    })
  }
}

// Ensure the request actor belongs to the supplier they are accessing
export function requireSameSupplier(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const paramSupplierId = req.params.supplierId
  if (!paramSupplierId || paramSupplierId === req.auth.supplierId) { next(); return }
  res.status(403).json({ success: false, error: 'Access denied to this supplier.' })
}