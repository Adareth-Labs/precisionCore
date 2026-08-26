import { transporter, FROM } from '@/config/email'
import { logger } from '@/config/logger'
import type { RFQStatus } from '@/types'

interface RFQEmailData {
  trackingId:   string
  partFamily:   string
  supplierName: string
  toEmail:      string
  status:       RFQStatus
  reviewNotes?: string
  portalUrl?:   string
}

interface PPAPEmailData {
  supplierId:    string
  supplierName:  string
  platformId:    string
  documentType:  string
  toEmail:       string
  reviewerEmail: string
}

interface CAREmailData {
  carId:        string
  severity:     string
  toEmail:      string
  assignedName: string
  description:  string
}

const PORTAL_URL = process.env.API_BASE_URL?.replace('api.', 'portal.') ?? 'https://portal.precisioncore.com'

const STATUS_SUBJECT: Partial<Record<RFQStatus, string>> = {
  SUBMITTED:              'RFQ Received — Action Required',
  UNDER_REVIEW:           'Your RFQ is Under Review',
  CLARIFICATION_REQUIRED: 'Clarification Requested on Your RFQ',
  APPROVED:               'Your RFQ Has Been Approved',
  REJECTED:               'RFQ Update — Review Required',
  IN_PRODUCTION:          'RFQ Moved to Production',
}

class EmailService {
  async sendRFQStatusUpdate(data: RFQEmailData): Promise<void> {
    const subject = STATUS_SUBJECT[data.status] ?? `RFQ Update: ${data.trackingId}`

    const html = `
      <div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;padding:40px 24px">
        <div style="font-size:20px;font-weight:500;letter-spacing:-0.02em;margin-bottom:32px">PRECISIONCORE</div>
        <h1 style="font-size:20px;font-weight:500;margin-bottom:8px">${subject}</h1>
        <p style="color:#444748;font-size:15px;margin-bottom:24px">
          Your RFQ <strong>${data.trackingId}</strong> for <strong>${data.partFamily}</strong>
          has been updated to: <strong>${data.status.replace(/_/g, ' ')}</strong>.
        </p>
        ${data.reviewNotes ? `<div style="background:#f3f4f5;padding:16px;border-left:3px solid #1a1c1e;margin-bottom:24px;font-size:14px;color:#444748">${data.reviewNotes}</div>` : ''}
        <a href="${data.portalUrl ?? PORTAL_URL}/rfq/${data.trackingId}"
           style="display:inline-block;background:#1a1c1e;color:#fff;padding:12px 24px;font-family:monospace;font-size:11px;letter-spacing:0.05em;text-transform:uppercase;text-decoration:none">
          View in Portal
        </a>
        <p style="color:#747878;font-size:12px;margin-top:32px">
          PrecisionCore Automotive · ISO 9001:2015 &amp; IATF 16949 Certified
        </p>
      </div>`

    await this.send({ to: data.toEmail, subject, html })
  }

  async sendPPAPUploadNotification(data: PPAPEmailData): Promise<void> {
    const html = `
      <div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;padding:40px 24px">
        <div style="font-size:20px;font-weight:500;margin-bottom:32px">PRECISIONCORE</div>
        <h1 style="font-size:20px;font-weight:500;margin-bottom:8px">PPAP Document Uploaded</h1>
        <p style="color:#444748;font-size:15px;margin-bottom:24px">
          <strong>${data.supplierName}</strong> has uploaded a <strong>${data.documentType}</strong>
          for platform <strong>${data.platformId}</strong>.
        </p>
        <a href="${PORTAL_URL}/ppap?supplier=${data.supplierId}"
           style="display:inline-block;background:#1a1c1e;color:#fff;padding:12px 24px;font-family:monospace;font-size:11px;letter-spacing:0.05em;text-transform:uppercase;text-decoration:none">
          Review Document
        </a>
      </div>`

    await this.send({ to: data.reviewerEmail, subject: 'PPAP Document Requires Review', html })
    await this.send({
      to:      data.toEmail,
      subject: 'PPAP Document Upload Confirmed',
      html:    html.replace('Requires Review', 'Received'),
    })
  }

  async sendCARAssignment(data: CAREmailData): Promise<void> {
    const colour = data.severity === 'CRITICAL' ? '#b91c1c' : '#b45309'
    const bg     = data.severity === 'CRITICAL' ? '#fef2f2' : '#fffbeb'

    const html = `
      <div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;padding:40px 24px">
        <div style="font-size:20px;font-weight:500;margin-bottom:32px">PRECISIONCORE</div>
        <h1 style="font-size:20px;font-weight:500;margin-bottom:8px">CAR Assigned: ${data.carId}</h1>
        <div style="background:${bg};border-left:3px solid ${colour};padding:12px 16px;margin-bottom:20px;font-size:13px">
          Severity: <strong>${data.severity}</strong>
        </div>
        <p style="color:#444748;font-size:15px;margin-bottom:8px">Hello ${data.assignedName},</p>
        <p style="color:#444748;font-size:15px;margin-bottom:24px">
          A corrective action report has been assigned to you: <em>${data.description}</em>
        </p>
        <a href="${PORTAL_URL}/quality/car/${data.carId}"
           style="display:inline-block;background:#1a1c1e;color:#fff;padding:12px 24px;font-family:monospace;font-size:11px;letter-spacing:0.05em;text-transform:uppercase;text-decoration:none">
          Open CAR Report
        </a>
      </div>`

    await this.send({ to: data.toEmail, subject: `CAR Assigned: ${data.carId} [${data.severity}]`, html })
  }

  private async send(msg: { to: string; subject: string; html: string }): Promise<void> {
    try {
      const info = await transporter.sendMail({
        from:    `"${FROM.name}" <${FROM.email}>`,
        to:      msg.to,
        subject: msg.subject,
        html:    msg.html,
      })
      logger.info('Email sent', { messageId: info.messageId, to: msg.to, subject: msg.subject })
    } catch (err) {
      logger.error('Email send failed', { error: String(err), to: msg.to, subject: msg.subject })
      // Do not throw — email failure must not break the primary operation
    }
  }
}

export const emailService = new EmailService()
