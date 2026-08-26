// src/styles/tokens.ts
// Precision Engine Design System — PrecisionCore Automotive Partner Portal

export const colors = {
  // Dark surfaces (login, dark cards)
  bg:        '#00020a',
  bgCard:    '#0a0f1e',
  bgBorder:  '#1e2a3d',

  // Light portal surfaces
  surface:          '#f8f9fc',
  surfaceCard:      '#ffffff',
  surfaceLow:       '#f0f2ff',
  surfaceContainer: '#e8ecff',
  surfaceHigh:      '#dde3fc',

  // Typography
  textLight: '#f0f4ff',
  textDark:  '#131b2e',
  textMuted: '#44474f',
  textFaint: '#6b7280',

  // Accent
  blue:      '#b1c6f9',
  blueDeep:  '#7084b3',
  navy:      '#001b44',
  navyMid:   '#283044',

  // Borders
  borderLight: '#dde1ef',
  borderMid:   '#9ba3bb',
  borderDark:  '#1e2a3d',

  // Semantic
  green:    '#16a34a',
  greenBg:  '#f0fdf4',
  amber:    '#d97706',
  amberBg:  '#fffbeb',
  red:      '#ba1a1a',
  redBg:    '#fef2f2',
} as const;

export const fonts = {
  heading: "'Hanken Grotesk', sans-serif",
  body:    "'Inter', sans-serif",
  mono:    "'JetBrains Mono', monospace",
} as const;

export const fontSizes = {
  xs:  9,
  sm:  11,
  md:  13,
  base:14,
  lg:  16,
  xl:  20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 36,
} as const;

export const spacing = {
  xs:  4,
  sm:  8,
  md:  12,
  lg:  16,
  xl:  20,
  '2xl': 24,
  '3xl': 32,
} as const;

// Google Fonts URL — import in globals.css or layout.tsx
export const FONT_URL =
  'https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700;900&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap';

export const ICONS_URL =
  'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0';
