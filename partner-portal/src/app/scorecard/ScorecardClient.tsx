'use client';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { Badge, KPICard, SectionHeader } from '@/components/ui';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { colors } from '@/styles/tokens';
import type { PortalUser } from '@/types';
const C = colors;

export default function ScorecardClient({ user, periods, company }: { user: PortalUser; periods: any[]; company: string }) {
  const { mob, tab } = useBreakpoint();
  const pad = mob ? 14 : tab ? 20 : 26;
  const latest = periods[0];
  const chartData = [...periods].reverse().map(p => ({ m: p.period.slice(5), ppm: p.qualityPPM, otd: p.deliveryOTD }));

  const Tip = ({ active, payload, label }: any) => active && payload?.length ? (
    <div style={{ background: C.textDark, padding: '8px 12px' }}>
      <div style={{ fontSize: 8, fontFamily: "'JetBrains Mono', monospace", color: C.blue, marginBottom: 3 }}>{label}</div>
      {payload.map((p: any) => <div key={p.name} style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: '#fff' }}>{p.name}: {p.value}</div>)}
    </div>
  ) : null;

  return (
    <div style={{ padding: pad, maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: mob?16:26, paddingBottom: mob?14:20, borderBottom: `1px solid ${C.borderLight}`, gap: 16, flexWrap: 'wrap' as const }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8, flexWrap: 'wrap' as const }}>
            <span style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", color: C.textFaint, border: `1px solid ${C.borderLight}`, padding: '2px 8px' }}>VENDOR: {user.vendorId}</span>
            <Badge s="Active" />
          </div>
          <h1 style={{ fontSize: mob?22:30, fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700, color: C.textDark, letterSpacing: '-0.02em' }}>{company}</h1>
          <p style={{ fontSize: 13, color: C.textMuted, marginTop: 4 }}>Direct Material Supplier — Powertrain & Engine Components</p>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: 8, fontFamily: "'JetBrains Mono', monospace", color: C.textFaint, textTransform: 'uppercase' as const, marginBottom: 4 }}>Global Scorecard</div>
          <div style={{ fontSize: mob?44:56, fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 900, color: C.textDark, lineHeight: 1 }}>{latest?.overallGrade ?? '—'}</div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 22 }}>
        <KPICard label="Quality (PPM)" value={latest?.qualityPPM ?? '—'} trend="↓ 12%" ok={true} sub="vs Target 100" icon="verified" />
        <KPICard label="Delivery OTD" value={latest?.deliveryOTD ?? '—'} unit="%" trend="↑ 0.5%" ok={true} sub="vs Target 98%" icon="local_shipping" />
        <KPICard label="Compliance" value="IATF" trend="Certified" ok={true} sub="Expires Q4 2025" icon="gavel" />
        <KPICard label="Innovation" value={latest?.innovation ?? '—'} unit="/100" ok={null} sub="R&D Engagement" icon="lightbulb" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: mob||tab ? '1fr' : '2fr 1fr', gap: 18 }}>
        <div style={{ background: C.surfaceCard, border: `1px solid ${C.borderLight}` }}>
          <div style={{ padding: '15px 18px', borderBottom: `1px solid ${C.borderLight}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' as const, gap: 8 }}>
            <h3 style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", fontWeight: 500, color: C.textDark, textTransform: 'uppercase' as const, letterSpacing: '0.1em' }}>Quality Performance (PPM)</h3>
            <div style={{ display: 'flex', gap: 12 }}>
              {[['PPM',C.textDark],['OTD%',C.blue]].map(([l,col]) => <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 5 }}><span style={{ width: 8, height: 8, background: col, display: 'inline-block' }} /><span style={{ fontSize: 8, fontFamily: "'JetBrains Mono', monospace", color: C.textFaint, textTransform: 'uppercase' as const }}>{l}</span></div>)}
            </div>
          </div>
          <div style={{ padding: mob?14:20 }}>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={mob?160:210}>
                <BarChart data={chartData} margin={{ top: 5, right: 0, bottom: 0, left: -24 }}>
                  <CartesianGrid strokeDasharray="2 4" stroke={C.borderLight} vertical={false} />
                  <XAxis dataKey="m" tick={{ fontSize: 8, fontFamily: "'JetBrains Mono', monospace", fill: C.textFaint }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 8, fontFamily: "'JetBrains Mono', monospace", fill: C.textFaint }} axisLine={false} tickLine={false} />
                  <Tooltip content={<Tip />} />
                  <Bar dataKey="ppm" name="ppm" fill={C.textDark} radius={0} />
                </BarChart>
              </ResponsiveContainer>
            ) : <div style={{ height: mob?160:210, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.textFaint, fontSize: 13 }}>No scorecard data yet</div>}
          </div>
        </div>
        <div style={{ background: C.surfaceCard, border: `1px solid ${C.borderLight}`, padding: mob?14:18 }}>
          <h3 style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", fontWeight: 500, color: C.textDark, textTransform: 'uppercase' as const, letterSpacing: '0.1em', marginBottom: 16 }}>Performance Breakdown</h3>
          {latest ? [
            ['Quality', latest.qualityPPM > 100 ? 70 : 95, C.green],
            ['Delivery', latest.deliveryOTD >= 98 ? 98 : 82, C.green],
            ['Responsiveness', latest.responsiveness, C.amber],
            ['Documentation', latest.documentation, C.amber],
            ['Innovation', latest.innovation, C.textDark],
            ['Sustainability', latest.sustainability, C.green],
          ].map(([l, v, col]) => (
            <div key={l as string} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: C.textMuted }}>{l as string}</span>
                <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, color: col as string }}>{v as number}%</span>
              </div>
              <div style={{ height: 3, background: C.surfaceLow }}><div style={{ width: `${v}%`, height: '100%', background: col as string }} /></div>
            </div>
          )) : <div style={{ color: C.textFaint, fontSize: 13 }}>No data yet</div>}
        </div>
      </div>
    </div>
  );
}
