import nodemailer from 'nodemailer'
import { env } from './env'
import { logger } from './logger'

// SMTP2Go relay — region-free, high-deliverability SMTP
// Credentials from: smtp2go.com → Dashboard → Senders → SMTP Users
export const transporter = nodemailer.createTransport({
  host:   env.SMTP_HOST,    // mail.smtp2go.com
  port:   env.SMTP_PORT,    // 587 (TLS/STARTTLS)  or  2525 (alternative)
  secure: env.SMTP_PORT === 465,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
  pool:           true,   // reuse connections for burst sends
  maxConnections: 5,
  maxMessages:    100,
})

// Verify on startup — non-fatal, app still boots if SMTP is misconfigured
transporter.verify().then(() => {
  logger.info('SMTP2Go connection verified', { host: env.SMTP_HOST, port: env.SMTP_PORT })
}).catch((err: unknown) => {
  logger.warn('SMTP2Go connection failed — emails will not send', { error: String(err) })
})

export const FROM = {
  email: env.SMTP_FROM,
  name:  env.SMTP_FROM_NAME,
}
