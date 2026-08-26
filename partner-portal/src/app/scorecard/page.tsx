import { getPortalUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

import { prisma } from '@/lib/db';
import ScorecardClient from './ScorecardClient';
import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Supplier Scorecard' };

export default async function ScorecardPage() {
  const user = await getPortalUser();
  if (!user) redirect('/login');
  if (user.tier < 2) redirect('/dashboard?error=insufficient_tier&required=2');
  const vendor = await prisma.vendor.findUnique({
    where: { vendorId: user.vendorId },
    include: { scorecards: { orderBy: { period: 'desc' }, take: 12 } },
  });
  const periods = vendor?.scorecards.map(s => ({
    period: s.period, qualityPPM: s.qualityPPM,
    deliveryOTD: Number(s.deliveryOTD), responsiveness: s.responsiveness,
    documentation: s.documentation, innovation: s.innovation,
    sustainability: s.sustainability, overallGrade: s.overallGrade,
  })) ?? [];
  return <ScorecardClient user={user} periods={periods} company={vendor?.company ?? user.company} />;
}
