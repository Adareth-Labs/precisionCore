import type { Response, NextFunction } from 'express'
import { createRemoteJWKSet, jwtVerify } from 'jose'
import type { AuthenticatedRequest } from '@/types'
import { env } from '@/config/env'
import { logger } from '@/config/logger'

// Supabase exposes a JWKS endpoint for RS256 token verification
const JWKS = createRemoteJWKSet(
  new URL(`${env.SUPABASE_URL}/auth/v1/.well-known/jwks.json`)
)

// Supabase JWT issuer
const ISSUER = `${env.SUPABASE_URL}/auth/v1`

function normalizeTier(value: unknown): AuthenticatedRequest['auth']['tier'] {
  if (value === 3 || value === '3' || value === 'STRATEGIC') return 'STRATEGIC'
  if (value === 2 || value === '2' || value === 'QUALIFIED') return 'QUALIFIED'
  return 'BASIC'
}

function extractAuth(payload: Record<string, unknown>): AuthenticatedRequest['auth'] {
  // Keep authorization data in Supabase app_metadata so users cannot alter their
  // tier/vendor claims from the client. A custom access-token hook can expose
  // these claims directly in the JWT; app_metadata is retained as the fallback.
  const meta = (payload['app_metadata'] ?? payload['user_metadata'] ?? {}) as Record<string, unknown>

  return {
    sub:        payload['sub'] as string,
    email:      payload['email'] as string,
    name:       (meta['name'] ?? payload['email']) as string,
    tier:       normalizeTier(meta['tier']),
    supplierId: (meta['supplier_id'] ?? meta['supplierId']) as string,
    vendorId:   (meta['vendor_id'] ?? meta['vendorId']) as string,
  }
}

export async function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ success: false, error: 'Missing or invalid Authorization header' })
    return
  }

  const token = authHeader.slice(7)

  try {
    const { payload } = await jwtVerify(token, JWKS, {
      issuer:   ISSUER,
      audience: 'authenticated',
    })

    req.auth = extractAuth(payload as Record<string, unknown>)
    next()
  } catch (err) {
    logger.warn('JWT validation failed', { error: String(err), ip: req.ip })
    res.status(401).json({ success: false, error: 'Invalid or expired token' })
  }
}

// Optional auth — does not reject, populates req.auth if token is valid
export async function optionalAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) { next(); return }

  try {
    const token = authHeader.slice(7)
    const { payload } = await jwtVerify(token, JWKS, {
      issuer:   ISSUER,
      audience: 'authenticated',
    })
    req.auth = extractAuth(payload as Record<string, unknown>)
  } catch { /* ignore */ }
  next()
}
