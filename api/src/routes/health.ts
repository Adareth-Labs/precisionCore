import { Router } from 'express'
import { db } from '@/config/database'

const router = Router()

router.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

router.get('/health/ready', async (_req, res) => {
  try {
    await db.$queryRaw`SELECT 1`
    res.json({ status: 'ready', database: 'connected' })
  } catch {
    res.status(503).json({ status: 'not ready', database: 'disconnected' })
  }
})

export default router