import { db } from '@/config/database'
import { emailService } from '@/services/email/EmailService'
import { auditService } from '@/services/audit/AuditService'
import { RFQ_TRANSITIONS, TRANSITION_TO_STATUS } from '@/types'
import type { RFQTransitionEvent } from '@/types'
import type { RFQStatus } from '@/types'
import { randomBytes } from 'crypto'

function generateTrackingId(): string {
  const year  = new Date().getFullYear()
  const token = randomBytes(3).toString('hex').toUpperCase()
  return `RFQ-${year}-${token}`
}

export interface CreateRFQInput {
  supplierId:     string
  productSlug?:   string
  partFamily:     string
  sku?:           string
  annualVolume?:  number
  minLotSize?:    number
  peakWeekly?:    number
  sopTargetDate?: string
  protoDate?:     string
  createdBy:      string
}

class RFQService {
  async create(input: CreateRFQInput) {
    const rfq = await db.rFQ.create({
      data: {
        trackingId:     generateTrackingId(),
        supplierId:     input.supplierId,
        productSlug:    input.productSlug,
        partFamily:     input.partFamily,
        sku:            input.sku,
        annualVolume:   input.annualVolume,
        minLotSize:     input.minLotSize,
        peakWeekly:     input.peakWeekly,
        sopTargetDate:  input.sopTargetDate  ? new Date(input.sopTargetDate)  : undefined,
        protoTargetDate:input.protoDate       ? new Date(input.protoDate)       : undefined,
        status:         'DRAFT',
        createdBy:      input.createdBy,
      },
    })

    await auditService.log({
      action:       'CREATE',
      actorId:      input.createdBy,
      actorEmail:   '',
      resourceType: 'RFQ',
      resourceId:   rfq.id,
      supplierId:   input.supplierId,
      rfqId:        rfq.id,
      afterState:   { status: 'DRAFT', trackingId: rfq.trackingId },
    })

    return rfq
  }

  async transition(
    rfqId:      string,
    event:      RFQTransitionEvent,
    actorId:    string,
    actorEmail: string,
    reason?:    string
  ) {
    const rfq = await db.rFQ.findUniqueOrThrow({ where: { id: rfqId } })
    const allowed = RFQ_TRANSITIONS[rfq.status as RFQStatus]

    if (!allowed.includes(event)) {
      throw new Error(
        `Cannot apply '${event}' to RFQ in status '${rfq.status}'. ` +
        `Allowed events: ${allowed.join(', ') || 'none'}.`
      )
    }

    const newStatus = TRANSITION_TO_STATUS[event]

    const [updated] = await db.$transaction([
      db.rFQ.update({
        where: { id: rfqId },
        data:  {
          status:       newStatus,
          reviewNotes:  reason,
          reviewedBy:   ['APPROVE','REJECT','REQUEST_CLARIFICATION'].includes(event) ? actorId : undefined,
          reviewedAt:   ['APPROVE','REJECT','REQUEST_CLARIFICATION'].includes(event) ? new Date() : undefined,
          submittedAt:  event === 'SUBMIT' ? new Date() : undefined,
        },
      }),
      db.rFQTransition.create({
        data: {
          rfqId,
          fromStatus: rfq.status,
          toStatus:   newStatus,
          actorId,
          actorEmail,
          reason,
        },
      }),
    ])

    await auditService.log({
      action:       'TRANSITION',
      actorId,
      actorEmail,
      resourceType: 'RFQ',
      resourceId:   rfqId,
      rfqId,
      supplierId:   rfq.supplierId,
      beforeState:  { status: rfq.status },
      afterState:   { status: newStatus },
      metadata:     { event, reason },
    })

    // Fetch supplier contact for notification
    const supplier = await db.supplier.findUnique({
      where:   { id: rfq.supplierId },
      include: { users: { take: 1 } },
    })

    if (supplier?.users[0]) {
      await emailService.sendRFQStatusUpdate({
        trackingId:   rfq.trackingId,
        partFamily:   rfq.partFamily,
        supplierName: supplier.companyName,
        toEmail:      supplier.users[0].email,
        status:       newStatus,
        reviewNotes:  reason,
      })
    }

    return updated
  }

  async findById(id: string) {
    return db.rFQ.findUnique({
      where:   { id },
      include: { documents: true, transitions: { orderBy: { createdAt: 'asc' } } },
    })
  }

  async findByTrackingId(trackingId: string) {
    return db.rFQ.findUnique({
      where:   { trackingId },
      include: { documents: true, transitions: { orderBy: { createdAt: 'asc' } } },
    })
  }

  async listForSupplier(supplierId: string, status?: RFQStatus) {
    return db.rFQ.findMany({
      where:   { supplierId, ...(status ? { status } : {}) },
      include: { documents: { select: { id: true, fileName: true, uploadedAt: true } } },
      orderBy: { createdAt: 'desc' },
    })
  }
}

export const rfqService = new RFQService()