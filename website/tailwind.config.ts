import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    // Override Tailwind defaults entirely with the Achromatic Industrial system
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#ffffff',
      black: '#000000',

      // ── Achromatic Industrial surface scale ──────────────────────
      surface: {
        DEFAULT: '#ffffff',
        low:     '#f3f4f5',
        mid:     '#edeeef',
        high:    '#e7e8e9',
        highest: '#e1e3e4',
      },
      background: {
        DEFAULT: '#f8f9fa',
      },

      // ── Text scale ───────────────────────────────────────────────
      ink: {
        primary:   '#191c1d',
        secondary: '#444748',
        tertiary:  '#747878',
      },

      // ── Border scale ─────────────────────────────────────────────
      stroke: {
        DEFAULT: '#c4c7c8',
        strong:  '#747878',
      },

      // ── Action ───────────────────────────────────────────────────
      action: {
        DEFAULT: '#1a1c1e',
        on:      '#ffffff',
      },

      // ── Semantic ─────────────────────────────────────────────────
      success: {
        DEFAULT: '#15803d',
        bg:      '#f0fdf4',
      },
      warning: {
        DEFAULT: '#b45309',
        bg:      '#fffbeb',
      },
      danger: {
        DEFAULT: '#b91c1c',
        bg:      '#fef2f2',
      },

      // ── Dark mode equivalents (used via dark: prefix) ─────────────
      // These are applied programmatically via dark: variants in components
    },

    fontFamily: {
      display: ['"Hanken Grotesk"', 'system-ui', 'sans-serif'],
      body:    ['"Hanken Grotesk"', 'system-ui', 'sans-serif'],
      mono:    ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
    },

    fontSize: {
      // Label scale
      'xs':  ['11px', { lineHeight: '1.4', letterSpacing: '0.05em' }],
      'sm':  ['12px', { lineHeight: '1.5', letterSpacing: '0.02em' }],
      // Body scale
      'base':['16px', { lineHeight: '1.7' }],
      'md':  ['14px', { lineHeight: '1.6' }],
      // Heading scale
      'lg':  ['16px', { lineHeight: '1.4', fontWeight: '500' }],
      'xl':  ['20px', { lineHeight: '1.3', fontWeight: '500' }],
      '2xl': ['24px', { lineHeight: '1.2', fontWeight: '500' }],
      '3xl': ['32px', { lineHeight: '1.1', fontWeight: '500' }],
      '4xl': ['40px', { lineHeight: '1.05', letterSpacing: '-0.01em', fontWeight: '500' }],
      '5xl': ['52px', { lineHeight: '1.0',  letterSpacing: '-0.02em', fontWeight: '500' }],
    },

    fontWeight: {
      normal: '400',
      medium: '500',
    },

    borderRadius: {
      none: '0px',
      DEFAULT: '0px',
    },

    extend: {
      maxWidth: {
        platform: '1440px',
        prose:    '720px',
        catalog:  '1200px',
      },
      spacing: {
        nav: '64px',
      },
      transitionDuration: {
        DEFAULT: '150ms',
      },
      transitionTimingFunction: {
        DEFAULT: 'linear',
      },
      animation: {
        // Only used when prefers-reduced-motion: no-preference
        'dot-pulse': 'dot-pulse 2s ease-in-out infinite',
      },
      keyframes: {
        'dot-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.4' },
        },
      },
    },
  },
  plugins: [],
}

export default config
