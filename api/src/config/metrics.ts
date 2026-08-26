import { Registry, collectDefaultMetrics, Counter, Histogram, Gauge } from 'prom-client'

export const register = new Registry()
register.setDefaultLabels({ app: 'precisioncore-api' })

// Node.js runtime metrics (event loop lag, heap usage, GC, active handles)
collectDefaultMetrics({ register })

// ── HTTP ──────────────────────────────────────────────────────────────────────

export const httpRequestsTotal = new Counter({
  name:       'http_requests_total',
  help:       'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'] as const,
  registers:  [register],
})

export const httpRequestDurationMs = new Histogram({
  name:       'http_request_duration_ms',
  help:       'HTTP request latency in milliseconds',
  labelNames: ['method', 'route', 'status_code'] as const,
  buckets:    [5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000],
  registers:  [register],
})

// ── Business ──────────────────────────────────────────────────────────────────

export const rfqSubmissionsTotal = new Counter({
  name:       'rfq_submissions_total',
  help:       'Total RFQ submissions',
  labelNames: ['status'] as const,
  registers:  [register],
})

export const ppapUploadsTotal = new Counter({
  name:       'ppap_uploads_total',
  help:       'Total PPAP document uploads',
  labelNames: ['level', 'status'] as const,
  registers:  [register],
})

export const documentDownloadsTotal = new Counter({
  name:       'document_downloads_total',
  help:       'Total document downloads',
  labelNames: ['resource_type'] as const,
  registers:  [register],
})

export const activeSupplierSessions = new Gauge({
  name:      'active_supplier_sessions',
  help:      'Currently active supplier sessions',
  registers: [register],
})

export const emailsSentTotal = new Counter({
  name:       'emails_sent_total',
  help:       'Total emails sent via SMTP2Go',
  labelNames: ['template', 'status'] as const,
  registers:  [register],
})
