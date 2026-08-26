// src/app/api/scorecard/route.ts
import { createClient } from '@/lib/supabase/server';
import { getPortalUser } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireTier } from '@/lib/rbac';

// GET /api/scorecard — fetch scorecard data for the authenticated vendor
export async function GET(req: NextRequest) {
  try {
    const user = await getPortalUser();
    if (!user) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });

    
    requireTier(user, 2);

    const vendor = await prisma.vendor.findUnique({
      where: { vendorId: user.vendorId },
      include: {
        scorecards: {
          orderBy: { period: 'desc' },
          take: 12, // Last 12 months
        },
      },
    });

    if (!vendor) return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });

    // Compute overall grade from most recent period
    const latest = vendor.scorecards[0];
    const overallGrade = latest?.overallGrade ?? 'N/A';

    return NextResponse.json({
      data: {
        vendorId: vendor.vendorId,
        company: vendor.company,
        tier: vendor.tier,
        overallGrade,
        periods: vendor.scorecards.map(s => ({
          period: s.period,
          qualityPPM: s.qualityPPM,
          deliveryOTD: Number(s.deliveryOTD),
          responsiveness: s.responsiveness,
          documentation: s.documentation,
          innovation: s.innovation,
          sustainability: s.sustainability,
          overallGrade: s.overallGrade,
        })),
      },
    });
  } catch (err) {
    console.error('[GET /api/scorecard]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}