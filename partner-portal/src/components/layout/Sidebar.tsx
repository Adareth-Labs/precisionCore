'use client';
// src/components/layout/Sidebar.tsx

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { colors } from '@/styles/tokens';
import type { PortalUser, Tier } from '@/types';

const C = colors;

const NAV_ITEMS: { href: string; label: string; icon: string; minTier: Tier }[] = [
  { href: '/dashboard',  label: 'Dashboard',          icon: 'dashboard',      minTier: 1 },
  { href: '/rfq',        label: 'RFQ Submission',      icon: 'description',    minTier: 2 },
  { href: '/ppap',       label: 'PPAP Hub',            icon: 'folder_shared',  minTier: 2 },
  { href: '/scorecard',  label: 'Supplier Scorecard',  icon: 'analytics',      minTier: 2 },
  { href: '/car',        label: 'CAR Workflow',        icon: 'report_problem', minTier: 3 },
  { href: '/capacity',   label: 'Capacity Dashboard',  icon: 'factory',        minTier: 3 },
];

interface SidebarProps {
  user: PortalUser;
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Close drawer on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  const tierLabel = { 1: 'TIER 01', 2: 'TIER 02', 3: 'TIER 03' }[user.tier];
  const initials = user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  const inner = (
    <>
      {/* Logo */}
      <div style={{ padding: '18px 16px 16px', borderBottom: `1px solid ${C.borderLight}`, flexShrink: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 900, color: C.textDark, letterSpacing: '-0.02em' }}>PRECISIONCORE AUTOMOTIVE</div>
        <div style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", color: C.textFaint, letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 2 }}>Partner Portal</div>
      </div>

      {/* User chip */}
      <div style={{ padding: '13px 14px', borderBottom: `1px solid ${C.borderLight}`, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, background: C.textDark, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: C.blue, flexShrink: 0 }}>{initials}</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.textDark, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</div>
            <div style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", color: C.textFaint, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user.vendorId} · {tierLabel}
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: 6, overflowY: 'auto' }}>
        {NAV_ITEMS.map(item => {
          const active = pathname.startsWith(item.href);
          const locked = user.tier < item.minTier;
          return (
            <Link key={item.href} href={locked ? '#' : item.href}
              aria-disabled={locked}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '11px 10px', marginBottom: 1,
                background: active ? C.surfaceHigh : 'transparent',
                borderTop: 'none', borderRight: 'none', borderBottom: 'none',
                borderLeft: active ? `3px solid ${C.textDark}` : '3px solid transparent',
                color: active ? C.textDark : locked ? C.borderLight : C.textMuted,
                fontWeight: active ? 600 : 400, fontSize: 13,
                fontFamily: "'Inter', sans-serif",
                textDecoration: 'none', pointerEvents: locked ? 'none' : 'auto',
              }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: active ? C.textDark : locked ? C.borderLight : C.textFaint }}>
                {item.icon}
              </span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {locked && !active && (
                <span className="material-symbols-outlined" style={{ fontSize: 13, color: C.borderLight }}>lock</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: '8px 6px', borderTop: `1px solid ${C.borderLight}`, flexShrink: 0 }}>
        <form action="/auth/signout" method="POST" style={{ width: '100%' }}>
          <button type="submit"
            style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 10px', background: 'transparent', border: 'none', color: C.red, fontSize: 13, cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16, color: C.red }}>logout</span>
            Sign Out
          </button>
        </form>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile backdrop */}
      {isMobile && open && (
        <div onClick={() => setOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 48 }} />
      )}

      {/* Mobile hamburger toggle — rendered outside sidebar so it's always accessible */}
      {isMobile && (
        <button onClick={() => setOpen(s => !s)}
          style={{ position: 'fixed', top: 14, left: 14, zIndex: 60, width: 36, height: 36, background: C.surfaceCard, border: `1px solid ${C.borderLight}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 20, color: C.textMuted }}>{open ? 'close' : 'menu'}</span>
        </button>
      )}

      <aside
        style={{
          width: 246, flexShrink: 0,
          background: C.surfaceCard,
          borderRight: `1px solid ${C.borderLight}`,
          display: 'flex', flexDirection: 'column',
          height: '100vh',
          position: isMobile ? 'fixed' : 'sticky',
          top: 0,
          left: isMobile ? (open ? 0 : -246) : 0,
          zIndex: isMobile ? 50 : 'auto' as never,
          transition: isMobile ? 'left 0.25s cubic-bezier(0.4,0,0.2,1)' : 'none',
          overflow: 'hidden',
        }}>
        {inner}
      </aside>
    </>
  );
}
