import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'PrecisionCore Automotive — Tier 1 Manufacturing'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%', height: '100%',
          display: 'flex', flexDirection: 'column',
          justifyContent: 'flex-end', padding: '64px',
          background: '#191c1d', color: '#ffffff',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 16, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.6, marginBottom: 16 }}>
          Tier 1 Automotive Manufacturing
        </div>
        <div style={{ fontSize: 52, fontWeight: 500, lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: 24 }}>
          Engineering Precision<br />for Global Mobility
        </div>
        <div style={{ fontSize: 18, opacity: 0.6 }}>
          PRECISIONCORE — NYSE: PCR
        </div>
      </div>
    ),
    { ...size }
  )
}