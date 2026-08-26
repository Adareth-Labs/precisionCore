import Link from 'next/link'
import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Page Not Found' }
export default function NotFoundPage() {
  return (
    <div className="max-w-prose mx-auto px-12 py-20 text-center">
      <span className="font-mono text-xs border border-danger text-danger bg-danger-bg px-2 py-0.5 inline-block mb-5">Error 404</span>
      <h1 className="text-2xl font-medium mb-3">Page not found</h1>
      <p className="text-base text-ink-secondary mb-8">The page you're looking for has moved, been removed, or the link may be incorrect.</p>
      <div className="relative mb-8">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-ink-secondary text-xl" aria-hidden="true">search</span>
        <input type="search" placeholder="Search solutions, certifications, documentation..." className="w-full border border-stroke pl-11 pr-4 py-3 text-base" aria-label="Site search" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[
          { label:'OEM Procurement', title:'Solutions catalog', body:'Browse components by technology domain with direct RFQ access.', href:'/solutions', cta:'View Solutions' },
          { label:'Investors', title:'Investor relations', body:'Access financial filings, ESG data matrix, and CSRD readiness.', href:'/company/investors', cta:'View Investor Hub' },
          { label:'Engineering Careers', title:'Open positions', body:'Browse roles by location, department, and seniority.', href:'/careers', cta:'View Careers' },
        ].map(({label,title,body,href,cta})=>(
          <div key={href} className="card p-6 text-left">
            <span className="section-label" style={{fontSize:'10px'}}>{label}</span>
            <h2 className="text-base font-medium mt-1 mb-2">{title}</h2>
            <p className="text-sm text-ink-secondary mb-4">{body}</p>
            <Link href={href} className="block w-full text-center bg-action text-white border border-action font-mono text-xs uppercase tracking-widest font-medium py-2 hover:opacity-85 transition-opacity">{cta} →</Link>
          </div>
        ))}
      </div>
    </div>
  )
}