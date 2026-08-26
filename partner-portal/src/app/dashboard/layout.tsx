// src/app/dashboard/layout.tsx
import { redirect } from 'next/navigation';
import { getPortalUser } from '@/lib/auth';
import Sidebar from '@/components/layout/Sidebar';
import TopBar   from '@/components/layout/TopBar';

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const user = await getPortalUser();
  if (!user) redirect('/login');
  return (
    <div className="portal-layout">
      <Sidebar user={user} />
      <div className="portal-main">
        <TopBar user={user} />
        <main className="portal-content">{children}</main>
      </div>
    </div>
  );
}
