// src/lib/auth.ts
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/db';
import type { PortalUser, Tier } from '@/types';

/**
 * Get the authenticated portal user, combining Supabase auth identity
 * with vendor/tier data from the database.
 *
 * Tier is stored in two places for performance:
 *  1. user.app_metadata.tier  — read by middleware (no DB hit)
 *  2. vendors.tier            — source of truth, read here for page data
 */
export async function getPortalUser(): Promise<PortalUser | null> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;

  // Fetch vendor record linked to this Supabase user
  const vendor = await prisma.vendor
    .findFirst({ where: { authUserId: user.id } })
    .catch(() => null);

  const tier = (vendor?.tier ?? user.app_metadata?.tier ?? 1) as Tier;
  const name =
    user.user_metadata?.full_name ??
    user.user_metadata?.name ??
    user.email ??
    'Partner';

  return {
    sub:      user.id,
    email:    user.email ?? '',
    name,
    picture:  user.user_metadata?.avatar_url as string | undefined,
    vendorId: vendor?.vendorId ?? '',
    company:  vendor?.company ?? (user.user_metadata?.company as string) ?? '',
    tier,
    role:     tier === 3 ? 'strategic' : tier === 2 ? 'qualified' : 'basic',
  };
}

/** Throw if the user's tier is below the required minimum. */
export function assertTier(user: PortalUser, minTier: Tier): void {
  if (user.tier < minTier) {
    throw new Error(
      `Insufficient access tier. Required: ${minTier}, current: ${user.tier}`,
    );
  }
}
