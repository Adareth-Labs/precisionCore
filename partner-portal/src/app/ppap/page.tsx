import { getPortalUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

import { prisma } from '@/lib/db';
import PPAPClient from './PPAPClient';
import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'PPAP Hub' };

export default async function PPAPPage() {
  const user = await getPortalUser();
  if (!user) redirect('/login');
  if (user.tier < 2) redirect('/dashboard?error=insufficient_tier&required=2');
  const vendor = await prisma.vendor.findUnique({ where: { vendorId: user.vendorId } });
  const docs = vendor ? await prisma.pPAPDocument.findMany({
    where: { vendorId: vendor.id }, orderBy: { uploadedAt: 'desc' },
  }) : [];
  const serialised = docs.map(d => ({
    ...d, uploadedAt: d.uploadedAt.toISOString(), updatedAt: d.updatedAt.toISOString(),
  }));
  return <PPAPClient user={user} initialDocs={serialised} />;
}
