// src/app/api/car/route.ts
import { createClient } from '@/lib/supabase/server';
import { getPortalUser } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { prisma, generateRefId } from '@/lib/db';
import { requireTier } from '@/lib/rbac';
import type { CreateCARInput } from '@/types';

// GET /api/car — list CARs for vendor
export async function GET(req: NextRequest) {
  try {
    const user = await getPortalUser();
    if (!user) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });

    
    requireTier(user, 3);

    const vendor = await prisma.vendor.findUnique({ where: { vendorId: user.vendorId } });
    if (!vendor) return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });

    const cars = await prisma.cAR.findMany({
      where: { vendorId: vendor.id },
      orderBy: { openedAt: 'desc' },
    });

    return NextResponse.json({ data: cars });
  } catch (err) {
    console.error('[GET /api/car]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

// POST /api/car — open a new CAR
export async function POST(req: NextRequest) {
  try {
    const user = await getPortalUser();
    if (!user) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });

    
    requireTier(user, 3);

    const body: CreateCARInput = await req.json();

    if (!body.nonConformingPart || !body.deviation || !body.affectedQty || !body.severity) {
      return NextResponse.json({ error: 'Missing required CAR fields' }, { status: 400 });
    }

    const vendor = await prisma.vendor.findUnique({ where: { vendorId: user.vendorId } });
    if (!vendor) return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });

    const count = await prisma.cAR.count();
    const referenceId = generateRefId('CAR', count + 1);

    const car = await prisma.cAR.create({
      data: {
        referenceId,
        vendorId: vendor.id,
        nonConformingPart: body.nonConformingPart,
        deviation: body.deviation,
        affectedQty: body.affectedQty,
        detectedBy: body.detectedBy,
        severity: body.severity,
        status: 'OPEN',
        currentStep: 1,
      },
    });

    return NextResponse.json({ data: car }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/car]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}