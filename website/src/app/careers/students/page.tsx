import Link from 'next/link'
import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Graduate & Student Programmes', description: 'Two-year graduate programme and six-month internships for engineering students.' }
export default function StudentsPage() {
  return (
    <div className="max-w-platform mx-auto px-12 py-12">
      <Link href="/careers" className="flex items-center gap-1.5 text-sm text-ink-secondary mb-8 hover:text-ink-primary transition-colors">
        <span className="material-symbols-outlined text-base" aria-hidden="true">arrow_back</span>Back to Careers
      </Link>
      <span className="section-label">Students & Graduates</span>
      <h1 className="text-3xl font-medium mb-10">Start your career in automotive engineering</h1>
      <div className="grid grid-cols-2 gap-8">
        {[
          { title:'Graduate Programme', desc:'2-year rotational programme across Engineering, Quality, and R&D divisions. Cohort of 12–15 graduates per intake.', specs:[['Next intake','September 2025'],['Duration','24 months'],['Locations','Stuttgart, Detroit, Nagoya'],['Applications open','February 2025']] },
          { title:'Internship Programme', desc:'6-month placements for penultimate-year students in Engineering or Computer Science. Paid at full market rate.', specs:[['Next intake','June 2025'],['Duration','6 months'],['Locations','All major hubs'],['Applications open','January 2025']] },
        ].map(({title,desc,specs})=>(
          <div key={title} className="card p-8">
            <h2 className="text-xl font-medium mb-3">{title}</h2>
            <p className="text-sm text-ink-secondary mb-6">{desc}</p>
            <dl>
              {specs.map(([l,v])=>(
                <div key={l} className="spec-row"><dt className="spec-label">{l}</dt><dd className="spec-value">{v}</dd></div>
              ))}
            </dl>
            <button type="button" className="mt-6 bg-action text-white border border-action font-mono text-xs uppercase tracking-widest font-medium px-5 py-2.5 hover:opacity-85 transition-opacity">Apply Now</button>
          </div>
        ))}
      </div>
    </div>
  )
}