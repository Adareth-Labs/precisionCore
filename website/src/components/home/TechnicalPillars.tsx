import Link from 'next/link'

const PILLARS = [
  { icon: 'bolt',     title: 'Electrification Systems', body: 'High-voltage power distribution, thermal management for battery arrays, and integrated e-axle components for next-generation EV platforms.', items: ['Thermal Management','Power Inverters','Busbar Solutions'] },
  { icon: 'settings', title: 'Advanced Drivetrain',      body: 'Precision-engineered transmission components, torque converters, and hybrid drivetrain solutions optimising mechanical efficiency and durability.', items: ['Hybrid Transmissions','Torque Vectoring','Gear Sets'] },
  { icon: 'memory',   title: 'Vehicle Electronics',      body: 'Automotive-grade PCBs, sensor arrays, and centralised control units built for extreme environments and real-time data delivery across E/E architectures.', items: ['Sensor Suites (ADAS)','ECU Assemblies','Wire Harnesses'] },
] as const

export function TechnicalPillars() {
  return (
    <section className="max-w-platform mx-auto px-12 py-16" aria-labelledby="pillars-heading">
      <div className="flex justify-between items-end border-b border-stroke pb-4 mb-10">
        <div>
          <span className="section-label">Core Competencies</span>
          <h2 id="pillars-heading" className="text-2xl font-medium">Technical Pillars</h2>
        </div>
        <Link href="/solutions" className="text-sm text-ink-secondary hover:text-ink-primary flex items-center gap-1 transition-colors">
          View Full Catalog
          <span className="material-symbols-outlined text-sm" aria-hidden="true">arrow_outward</span>
        </Link>
      </div>
      <div className="grid grid-cols-3 gap-6">
        {PILLARS.map((p) => (
          <article key={p.title} className="card card-hover p-8">
            <span className="material-symbols-outlined text-3xl text-ink-secondary mb-4 block" aria-hidden="true">{p.icon}</span>
            <h3 className="text-lg font-medium mb-3">{p.title}</h3>
            <p className="text-md text-ink-secondary mb-5">{p.body}</p>
            <ul className="text-sm text-ink-secondary space-y-0">
              {p.items.map((item, i) => (
                <li key={item} className={`py-1 ${i < p.items.length - 1 ? 'border-b border-stroke' : ''}`}>· {item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  )
}
