// src/app/page.tsx
import { redirect } from 'next/navigation';
import { getPortalUser } from '@/lib/auth';

export default async function RootPage() {
  const user = await getPortalUser();
  redirect(user ? '/dashboard' : '/login');
}
