// src/hooks/useBreakpoint.ts
'use client';

import { useState, useEffect } from 'react';

interface Breakpoint {
  mob: boolean;   // < 768px
  tab: boolean;   // < 1180px
  width: number;
}

export function useBreakpoint(): Breakpoint {
  const [width, setWidth] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1200,
  );

  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return {
    mob: width < 768,
    tab: width < 1180,
    width,
  };
}
