import { getPortalUser } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';

import { prisma } from '@/lib/db';
import CARDetailClient from './CARDetailClient';
import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'CAR Detail' };

export default async function CARDetailPage({ params }: { params: { id: string } }) {
  const user = await getPortalUser();
  if (!user) redirect('/login');
  if (user.tier < 3) redirect('/dashboard?error=insufficient_tier&required=3');
  const vendor = await prisma.vendor.findUnique({ where: { vendorId: user.vendorId } });
  if (!vendor) redirect('/dashboard');
  const car = await prisma.cAR.findFirst({ where: { id: params.id, vendorId: vendor.id } });
  if (!car) notFound();
  return <CARDetailClient user={user} car={{ ...car, openedAt: car.openedAt.toISOString(), closedAt: car.closedAt?.toISOString() ?? null, updatedAt: car.updatedAt.toISOString() }} />;
}
