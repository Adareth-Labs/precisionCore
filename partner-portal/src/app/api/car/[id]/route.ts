// src/app/api/car/[id]/route.ts
import { createClient } from '@/lib/supabase/server';
import { getPortalUser } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireTier } from '@/lib/rbac';
import type { UpdateCARInput } from '@/types';

// PATCH /api/car/[id] — advance step or update CAR fields
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const user = await getPortalUser();
    if (!user) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });

    
    requireTier(user, 3);

    const body: UpdateCARInput = await req.json();

    const vendor = await prisma.vendor.findUnique({ where: { vendorId: user.vendorId } });
    if (!vendor) return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });

    // Ensure the CAR belongs to this vendor
    const existing = await prisma.cAR.findFirst({
      where: { id: params.id, vendorId: vendor.id },
    });
    if (!existing) return NextResponse.json({ error: 'CAR not found' }, { status: 404 });
    if (existing.status === 'CLOSED') {
      return NextResponse.json({ error: 'Cannot update a closed CAR' }, { status: 409 });
    }

    const updated = await prisma.cAR.update({
      where: { id: params.id },
      data: {
        ...body,
        // Auto-close when final step submitted
        ...(body.currentStep === 3 && body.closureNotes
          ? { status: 'PENDING_REVIEW', closedAt: null }
          : {}),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ data: updated });
  } catch (err) {
    console.error('[PATCH /api/car/[id]]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

// GET /api/car/[id] — fetch a single CAR
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const user = await getPortalUser();
    if (!user) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });

    
    requireTier(user, 3);

    const vendor = await prisma.vendor.findUnique({ where: { vendorId: user.vendorId } });
    if (!vendor) return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });

    const car = await prisma.cAR.findFirst({ where: { id: params.id, vendorId: vendor.id } });
    if (!car) return NextResponse.json({ error: 'CAR not found' }, { status: 404 });

    return NextResponse.json({ data: car });
  } catch (err) {
    console.error('[GET /api/car/[id]]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}