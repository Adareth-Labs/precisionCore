import { getPortalUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

import { prisma } from '@/lib/db';
import CARClient from './CARClient';
import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'CAR Workflow' };

export default async function CARPage() {
  const user = await getPortalUser();
  if (!user) redirect('/login');
  if (user.tier < 3) redirect('/dashboard?error=insufficient_tier&required=3');
  const vendor = await prisma.vendor.findUnique({ where: { vendorId: user.vendorId } });
  const cars = vendor ? await prisma.cAR.findMany({
    where: { vendorId: vendor.id }, orderBy: { openedAt: 'desc' },
  }) : [];
  const serialised = cars.map(c => ({
    ...c,
    openedAt: c.openedAt.toISOString(),
    closedAt: c.closedAt?.toISOString() ?? null,
    updatedAt: c.updatedAt.toISOString(),
  }));
  return <CARClient user={user} initialCARs={serialised} />;
}
