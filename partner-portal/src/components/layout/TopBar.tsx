'use client';
// src/components/layout/TopBar.tsx

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { colors } from '@/styles/tokens';
import type { PortalUser } from '@/types';

const C = colors;

export default function TopBar({ user }: { user: PortalUser }) {
  const [isMobile, setIsMobile] = useState(false);
  const initials = user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <header style={{
      height: 58, background: C.surfaceCard,
      borderBottom: `1px solid ${C.borderLight}`,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: isMobile ? '0 16px 0 60px' : '0 26px',
      position: 'sticky', top: 0, zIndex: 40, flexShrink: 0, gap: 12,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
        {isMobile
          ? <span style={{ fontSize: 13, fontWeight: 700, color: C.textDark, letterSpacing: '-0.01em' }}>Partner Portal</span>
          : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: C.surfaceLow, border: `1px solid ${C.borderLight}`, padding: '7px 11px', width: 280 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 16, color: C.textFaint }}>search</span>
              <input
                placeholder="Search RFQs, part numbers, suppliers..."
                style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: 12, color: C.textDark, width: '100%', fontFamily: "'Inter', sans-serif" }}
              />
            </div>
          )
        }
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 4 : 8, flexShrink: 0 }}>
        {!isMobile && (
          <>
            <button style={{ padding: 8, background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', color: C.textMuted }}>
              <span className="material-symbols-outlined" style={{ fontSize: 19 }}>notifications</span>
            </button>
            <button style={{ padding: 8, background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', color: C.textMuted }}>
              <span className="material-symbols-outlined" style={{ fontSize: 19 }}>help_outline</span>
            </button>
          </>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: isMobile ? 0 : 4 }}>
          {!isMobile && (
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.textDark }}>{user.name}</div>
              <div style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", color: C.textFaint }}>{user.company}</div>
            </div>
          )}
          <div style={{ width: 30, height: 30, background: C.textDark, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: C.blue, flexShrink: 0 }}>
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
}
