import { getPortalUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

import { prisma } from '@/lib/db';
import CapacityClient from './CapacityClient';
import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Capacity Dashboard' };

export default async function CapacityPage() {
  const user = await getPortalUser();
  if (!user) redirect('/login');
  if (user.tier < 3) redirect('/dashboard?error=insufficient_tier&required=3');
  const vendor = await prisma.vendor.findUnique({ where: { vendorId: user.vendorId } });
  const snapshots = vendor ? await prisma.capacitySnapshot.findMany({
    where: { vendorId: vendor.id },
    orderBy: { snapshotAt: 'desc' },
    distinct: ['lineId'],
  }) : [];
  const lines = snapshots.map(s => ({
    lineId: s.lineId, lineName: s.lineName,
    oee: Number(s.oee), utilization: Number(s.utilization), status: s.status,
  }));
  return <CapacityClient user={user} lines={lines} />;
}
