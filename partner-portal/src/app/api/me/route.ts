// src/app/api/me/route.ts
// Returns the current user's portal profile (vendor + tier data).
// Called by client components that can't use server-side getPortalUser().
import { NextResponse } from 'next/server';
import { getPortalUser } from '@/lib/auth';

export async function GET() {
  const user = await getPortalUser();
  if (!user) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  return NextResponse.json({ data: user });
}
