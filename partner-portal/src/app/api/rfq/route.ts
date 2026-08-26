// src/app/api/rfq/route.ts
import { createClient } from '@/lib/supabase/server';
import { getPortalUser } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { prisma, generateRefId } from '@/lib/db';
import { requireTier } from '@/lib/rbac';
import type { CreateRFQInput } from '@/types';

// GET /api/rfq — list vendor's RFQ submissions
export async function GET(req: NextRequest) {
  try {
    const user = await getPortalUser();
    if (!user) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });

    
    requireTier(user, 2);

    const { searchParams } = req.nextUrl;
    const page = parseInt(searchParams.get('page') ?? '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') ?? '20', 10);
    const status = searchParams.get('status') ?? undefined;

    const vendor = await prisma.vendor.findUnique({ where: { vendorId: user.vendorId } });
    if (!vendor) return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });

    const [items, total] = await Promise.all([
      prisma.rFQSubmission.findMany({
        where: { vendorId: vendor.id, ...(status ? { status: status as never } : {}) },
        include: { documents: { select: { id: true, fileName: true, fileType: true, sizeBytes: true, uploadedAt: true } } },
        orderBy: { submittedAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.rFQSubmission.count({ where: { vendorId: vendor.id } }),
    ]);

    return NextResponse.json({ items, total, page, pageSize });
  } catch (err) {
    console.error('[GET /api/rfq]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

// POST /api/rfq — create a new RFQ submission
export async function POST(req: NextRequest) {
  try {
    const user = await getPortalUser();
    if (!user) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });

    
    requireTier(user, 2);

    const body: CreateRFQInput = await req.json();

    // Basic validation
    if (!body.partNumber || !body.partName || !body.annualVolume || !body.targetPrice) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const vendor = await prisma.vendor.findUnique({ where: { vendorId: user.vendorId } });
    if (!vendor) return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });

    // Generate sequential reference ID
    const count = await prisma.rFQSubmission.count();
    const referenceId = generateRefId('RFQ', count + 1);

    const rfq = await prisma.rFQSubmission.create({
      data: {
        referenceId,
        vendorId: vendor.id,
        partNumber: body.partNumber,
        partName: body.partName,
        annualVolume: body.annualVolume,
        targetPrice: body.targetPrice,
        material: body.material,
        toleranceClass: body.toleranceClass,
        drawingRef: body.drawingRef,
        requiredBy: body.requiredBy ? new Date(body.requiredBy) : undefined,
        notes: body.notes,
        status: 'PENDING',
      },
    });

    return NextResponse.json({ data: rfq, message: 'RFQ submitted successfully' }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/rfq]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}