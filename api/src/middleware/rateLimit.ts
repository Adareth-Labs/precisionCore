import rateLimit from 'express-rate-limit'
import { env } from '@/config/env'

export const globalLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max:      env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders:   false,
  message: { success: false, error: 'Too many requests. Please try again later.' },
})

// Stricter limiter for document downloads (prevent bulk scraping)
export const downloadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max:      50,
  message: { success: false, error: 'Download limit reached. Please contact support.' },
})

// Stricter limiter for RFQ submissions
export const rfqLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max:      20,
  message: { success: false, error: 'RFQ submission limit reached.' },
})