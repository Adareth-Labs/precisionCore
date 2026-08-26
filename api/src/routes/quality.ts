import { Router } from 'express'
import { z } from 'zod'
import { authenticate } from '@/middleware/auth'
import { requirePermission } from '@/middleware/rbac'
import { db } from '@/config/database'
import { emailService } from '@/services/email/EmailService'
import { auditService } from '@/services/audit/AuditService'
import type { AuthenticatedRequest, CARStatus } from '@/types'
import type { Response } from 'express'
import { randomBytes } from 'crypto'

const router = Router()

const createSchema = z.object({
  severity:            z.enum(['MINOR','MAJOR','CRITICAL']),
  deviationDescription:z.string().min(10),
  partId:              z.string().optional(),
  batchNumber:         z.string().optional(),
  rfqId:               z.string().uuid().optional(),
  lotNumber:           z.string().optional(),
  assignedTo:          z.string().optional(),
})

const transitionSchema = z.object({
  event: z.enum(['IDENTIFY_ROOT_CAUSE','SUBMIT_ACTION_PLAN','REQUEST_VERIFICATION','CLOSE','ESCALATE']),
  rootCause:       z.string().optional(),
  correctiveAction:z.string().optional(),
  preventiveAction:z.string().optional(),
  actionDueDate:   z.string().datetime().optional(),
})

const EVENT_TO_STATUS: Record<string, CARStatus> = {
  IDENTIFY_ROOT_CAUSE:   'ROOT_CAUSE_IDENTIFIED',
  SUBMIT_ACTION_PLAN:    'ACTION_PLAN_SUBMITTED',
  REQUEST_VERIFICATION:  'VERIFICATION_PENDING',
  CLOSE:                 'CLOSED',
  ESCALATE:              'ESCALATED',
}

function generateCARId(): string {
  const year  = new Date().getFullYear()
  const token = randomBytes(2).toString('hex').toUpperCase()
  return `CAR-${year}-${token}`
}

router.get('/', authenticate, requirePermission('car:read'), async (req: AuthenticatedRequest, res: Response) => {
  const cars = await db.cARReport.findMany({
    where:   { supplierId: req.auth.supplierId },
    orderBy: { createdAt: 'desc' },
  })
  res.json({ success: true, data: cars })
})

router.post('/', authenticate, requirePermission('car:create'), async (req: AuthenticatedRequest, res: Response) => {
  const body = createSchema.parse(req.body)
  const car  = await db.cARReport.create({
    data: {
      carId:               generateCARId(),
      supplierId:          req.auth.supplierId,
      severity:            body.severity,
      deviationDescription:body.deviationDescription,
      partId:              body.partId,
      batchNumber:         body.batchNumber,
      rfqId:               body.rfqId,
      lotNumber:           body.lotNumber,
      assignedTo:          body.assignedTo,
      createdBy:           req.auth.sub,
    },
  })

  if (body.assignedTo) {
    const assignee = await db.supplierUser.findUnique({ where: { supabaseId: body.assignedTo } })
    if (assignee) {
      await emailService.sendCARAssignment({
        carId:        car.carId,
        severity:     body.severity,
        toEmail:      assignee.email,
        assignedName: assignee.name,
        description:  body.deviationDescription,
      })
    }
  }

  await auditService.log({
    action: 'CREATE', actorId: req.auth.sub, actorEmail: req.auth.email,
    actorTier: req.auth.tier, resourceType: 'CAR',
    resourceId: car.id, supplierId: req.auth.supplierId, carId: car.id,
    afterState: { status: 'OPEN', severity: body.severity },
  })

  res.status(201).json({ success: true, data: car })
})

router.get('/:id', authenticate, requirePermission('car:read'), async (req: AuthenticatedRequest, res: Response) => {
  const car = await db.cARReport.findUnique({
    where:   { id: req.params.id },
    include: { documents: true },
  })
  if (!car || car.supplierId !== req.auth.supplierId) {
    res.status(404).json({ success: false, error: 'CAR not found' }); return
  }
  res.json({ success: true, data: car })
})

router.post('/:id/transition', authenticate, requirePermission('car:transition'), async (req: AuthenticatedRequest, res: Response) => {
  const body   = transitionSchema.parse(req.body)
  const before = await db.cARReport.findUniqueOrThrow({ where: { id: req.params.id } })
  const newStatus = EVENT_TO_STATUS[body.event] as CARStatus

  const car = await db.cARReport.update({
    where: { id: req.params.id },
    data:  {
      status:           newStatus,
      rootCause:        body.rootCause,
      correctiveAction: body.correctiveAction,
      preventiveAction: body.preventiveAction,
      actionDueDate:    body.actionDueDate ? new Date(body.actionDueDate) : undefined,
      verifiedBy:       body.event === 'REQUEST_VERIFICATION' ? req.auth.sub : undefined,
      verifiedAt:       body.event === 'REQUEST_VERIFICATION' ? new Date() : undefined,
      closedBy:         body.event === 'CLOSE' ? req.auth.sub : undefined,
      closedAt:         body.event === 'CLOSE' ? new Date() : undefined,
    },
  })

  await auditService.log({
    action: 'TRANSITION', actorId: req.auth.sub, actorEmail: req.auth.email,
    actorTier: req.auth.tier, resourceType: 'CAR', resourceId: car.id,
    supplierId: req.auth.supplierId, carId: car.id,
    beforeState: { status: before.status }, afterState: { status: newStatus },
    metadata: { event: body.event },
  })

  res.json({ success: true, data: car })
})

export default router