// src/lib/rbac.ts
import type { Tier, PortalUser } from '@/types';

export const TIER_NAMES: Record<Tier, string> = {
  1: 'Basic',
  2: 'Qualified',
  3: 'Strategic',
};

export const TIER_LABELS: Record<Tier, string> = {
  1: 'TIER 01',
  2: 'TIER 02',
  3: 'TIER 03',
};

/**
 * Route-level minimum tier requirements.
 * The middleware enforces these, but API routes also call assertTier()
 * to provide defense-in-depth.
 */
export const ROUTE_MIN_TIER: Record<string, Tier> = {
  rfq:       2,
  ppap:      2,
  scorecard: 2,
  car:       3,
  capacity:  3,
};

export function canAccess(user: PortalUser, feature: keyof typeof ROUTE_MIN_TIER): boolean {
  return user.tier >= ROUTE_MIN_TIER[feature];
}

export function requireTier(user: PortalUser, minTier: Tier): void {
  if (user.tier < minTier) {
    throw new AuthorizationError(
      `This feature requires ${TIER_NAMES[minTier]} access (Tier ${minTier}).`,
      minTier,
    );
  }
}

export class AuthorizationError extends Error {
  constructor(
    message: string,
    public readonly requiredTier: Tier,
  ) {
    super(message);
    this.name = 'AuthorizationError';
  }
}

/**
 * Wrap an API route handler with tier enforcement.
 * Returns 403 with a structured error body if tier is insufficient.
 */
export function withTier(minTier: Tier, handler: (user: PortalUser, ...args: unknown[]) => Promise<Response>) {
  return async (user: PortalUser, ...args: unknown[]) => {
    try {
      requireTier(user, minTier);
      return await handler(user, ...args);
    } catch (err) {
      if (err instanceof AuthorizationError) {
        return Response.json(
          { error: err.message, requiredTier: err.requiredTier },
          { status: 403 },
        );
      }
      throw err;
    }
  };
}
